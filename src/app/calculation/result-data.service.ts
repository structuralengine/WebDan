import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(private save: SaveDataService) {
  }

  // 断面力一覧を取得 ////////////////////////////////////////////////////////////////
  public getDesignForceList(calcTarget: string, pickupNoList: number[]): any[] {

    let result: any[];
    if (this.save.isManual() === true) {
      result = this.getDesignForceFromManualInput(calcTarget, pickupNoList);
    } else {
      result = this.getDesignForceFromPickUpData(calcTarget, pickupNoList);
    }
    return result;
  }

  // 断面力手入力情報から断面力一覧を取得
  private getDesignForceFromManualInput(calcTarget: string, pickupNoList: number[]): any[] {

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(calcTarget);

    // 断面力を取得
    let force: any[];
    switch (calcTarget) {
      case 'Moment': // 曲げモーメントの照査の場合
        force = this.save.force.Mdatas;
        break;
      case 'ShearForce': // せん断力の照査の場合
        force = this.save.force.Vdatas;
        break;
    }

    // 断面力を追加
    for (const pickupNo of pickupNoList) {

      for (const groupe of result) {
        for (const member of groupe) {
          const targetMember = force.find(function (value) {
            return (value.m_no === member.m_no);
          });
          if (targetMember === undefined) {
            return new Array(); // 存在しない要素番号がある
          }
          for (const position of member.positions) {

            if (targetMember.case.length < pickupNo) {
              return new Array(); // ピックアップ番号の入力が不正
            }
            const targetForce = targetMember.case[pickupNo];

            if ('designForce' in position === false) {
              position['designForce'] = new Array();
            }
            const designForce = {
              Manual: targetForce
            };
            position['designForce'].push(designForce);
          }
        }
      }
    }

    return result;
  }

  // ピックアップデータから断面力一覧を取得
  private getDesignForceFromPickUpData(calcTarget: string, pickupNoList: number[]): any[] {

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(calcTarget);

    // 断面力を取得
    const force: object = this.save.pickup_data;

    // 断面力を追加
    for (let i = 0; i < pickupNoList.length; i++) {
      const pickupNo: string = 'pickUpNo:' + pickupNoList[i];
      if (pickupNo in force === false) {
        return new Array(); // ピックアップ番号の入力が不正
      }
      const targetForce = force[pickupNo];

      for (const groupe of result) {
        for (const member of groupe) {
          const targetMember = targetForce.find(function (value) {
            return (value.memberNo === member.m_no);
          });
          if (targetMember === undefined) {
            return new Array(); // 存在しない要素番号がある
          }

          for (const position of member.positions) {
            const targetPosition = targetMember.positions.find(function (value) {
              return (value.index === position.index);
            });
            if (targetPosition === undefined) {
              return new Array(); // 存在しない着目点がある
            }
            if ('designForce' in position === false) {
              position['designForce'] = new Array();
            }
            const designForce = {
              Mmax: targetPosition['M'].max,
              Mmin: targetPosition['M'].min,
              Smax: targetPosition['S'].max,
              Smin: targetPosition['S'].min,
              Nmax: targetPosition['N'].max,
              Nmin: targetPosition['N'].min
            };
            position['designForce'].push(designForce);
          }
        }
      }

    }

    return result;
  }

  // 計算対象の着目点のみを抽出する
  private getEnableMembers(calcTarget: string): any[] {

    const result = JSON.parse(
      JSON.stringify({
        temp: this.save.points.getDesignPointColumns()
      })
    ).temp;

    // 計算対象ではない着目点を削除する
    let groupe_delete_flug: boolean = true;
    while (groupe_delete_flug) {
      groupe_delete_flug = false;

      for (let i = 0; i < result.length; i++) {
        const groupe = result[i];
        // 計算・印刷画面の部材にチェックが入っていなかければ削除
        if (this.save.calc.calc_checked[i] === false) {
          result.splice(i, 1);
          groupe_delete_flug = true;
          break;
        }

        let member_delete_flug: boolean = true;
        while (member_delete_flug) {
          member_delete_flug = false;

          for (let j = 0; j < groupe.length; j++) {
            const positions: any[] = groupe[j].positions;

            let position_delete_flug: boolean = true;
            while (position_delete_flug) {
              position_delete_flug = false;

              for (let k = 0; k < positions.length; k++) {
                let enable: boolean;
                switch (calcTarget) {
                  case 'Moment':
                    // 曲げモーメントの照査の場合
                    enable = (positions[k].isMyCalc === true || positions[k].isMzCalc === true);
                    break;
                  case 'ShearForce':
                    // せん断力の照査の場合
                    enable = (positions[k].isVyCalc === true || positions[k].isVzCalc === true);
                    break;
                }

                if (enable === false) {
                  positions.splice(k, 1);
                  position_delete_flug = true;
                  break;
                }

              }

              // 照査する着目点がなければ 対象部材を削除
              if (positions.length === 0) {
                groupe.splice(j, 1);
                member_delete_flug = true;
                break;
              }
            }
          }
        }

        // 照査する部材がなければ 対象グループを削除
        if (groupe.length === 0) {
          result.splice(i, 1);
          groupe_delete_flug = true;
          break;
        }
      }
    }
    return result;
  }

  // position.SectionData に安全係数情報を追加する ///////////////////////////////////////////////////////
  public setSafetyFactor(calcTarget: string, g_no: number, position: any, tableIndex: number): void {

    const safetyList = this.save.safety.safety_factor_material_strengths_list.find(function (value) {
      return value.g_no === g_no;
    });
    if (safetyList === undefined) {
      console.log("安全係数がないので計算対象外")
      position.SectionData = new Array();
      return;
    }

    // 安全係数 を代入する
    let safety_factor: object;
    switch (calcTarget) {
      case 'Moment': // 曲げモーメントの照査の場合
        safety_factor = {
          rc: safetyList.safety_factor[tableIndex].M_rc,
          rs: safetyList.safety_factor[tableIndex].M_rs,
          range: safetyList.safety_factor[tableIndex].range
        };
        break;
      case 'ShearForce':// せん断力の照査の場合
        safety_factor = {
          rc: safetyList.safety_factor[tableIndex].V_rc,
          rs: safetyList.safety_factor[tableIndex].V_rs,
          range: safetyList.safety_factor[tableIndex].range
        };
        break;
    }
    position['safety_factor'] = safety_factor; // 安全係数

    // 材料強度 を代入する
    position['material_steel'] = safetyList.material_steel; // 鉄筋強度
    position['material_concrete'] = safetyList.material_concrete; // コンクリート強度

    // 杭の施工条件
    let pile_factor = this.save.safety.pile_factor_list.find(function (value) {
      return value.id === safetyList.pile_factor_selected;
    });
    if (pile_factor === undefined) {
      pile_factor = safetyList.pile_factor_list[0];
    }
    position['pile_factor'] = pile_factor;

  }

  // position に コンクリート断面情報を入力する /////////////////////////////////////////////////////////////////////
  public setSectionData(g_no: number, m_no: number, position: any): void {

    // 部材・断面情報をセット
    const memberInfo = this.save.members.member_list.find(function (value) {
      return (value.m_no === m_no);
    });
    if (memberInfo === undefined) {
      console.log('部材番号が存在しない');
      position.SectionData = new Array();
      return;
    }
    position['memberInfo'] = memberInfo;

    // 鉄筋の入力情報ををセット
    this.setBarData(g_no, m_no, position);

    // POST 用の断面情報をセット
    if (memberInfo.shape.indexOf('円') > 0) {

      // 円形の場合は 上側引張、下側引張　どちらかにする
      if (position.SectionData.length > 1) {
        if (Math.abs(position.SectionData[0]) > Math.abs(position.SectionData[1])) {
          position.SectionData.pop(); // 末尾の要素を取り除く
        } else {
          position.SectionData.shift(); // 先頭の要素を取り除く
        }
      }
      if (memberInfo.shape.indexOf('円形') > 0) {
        if (this.getCircle(position) === false) {
          position.SectionData = new Array();
          return;
        }
      } else if (memberInfo.shape.indexOf('円環') > 0) {
        if (this.getRing(position) === false) {
          position.SectionData = new Array();
          return;
        }
      }

    } else if (memberInfo.shape.indexOf('矩形') > 0) {

      for (let i = position.SectionData.length - 1; i >= 0; i--) {
        if (this.getRectangle(position, i) === false) {
          position.SectionData.splice(i, 1);
        }
      }

    } else if (memberInfo.shape.indexOf('T') > 0) {

      // Ｔ形に関する 設計条件を確認する
      let condition = this.save.basic.conditions_list.find(function (value) {
        return (value.id === 'JR-002');
      });
      if (condition === undefined) {
        condition = { id: 'undefined', selected: false };
      }

      for (let i = position.SectionData.length - 1; i >= 0; i--) {
        let isEnable: boolean;
        if (memberInfo.shape.indexOf('T形') > 0) {
          if (condition.selected === true && position.SectionData[i].memo === '上側引張') {
            // T形 断面の上側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getTsection(position, i);
          }
        } else if (memberInfo.shape.indexOf('逆T形') > 0) {
          if (condition.selected === true && position.SectionData[i].memo=== '下側引張') {
            // 逆T形 断面の下側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getInvertedTsection(position, i);
          }
        } else {
          isEnable = false;
        }
        if (isEnable === false) {
          position.SectionData.splice(i, 1);
        }

      }

    } else if (memberInfo.shape.indexOf('小判形') > 0) {

      for (const SectionData of position.SectionData) {
        if (memberInfo.B > memberInfo.H) {
          SectionData['PostData'] = this.getHorizontalOval(memberInfo.B, memberInfo.H);
        } else if (memberInfo.B < memberInfo.H) {
          SectionData['PostData'] = this.getVerticalOval(memberInfo.B, memberInfo.H);
        } else if (memberInfo.B === memberInfo.H) {
          SectionData['PostData'] = this.getCircle(memberInfo.H);
        }
      }

    } else {
      console.log("断面形状：" + memberInfo.shape + " は適切ではありません。");
      position.SectionData = new Array();
      return;
    }

  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOval(b: number, h: number): any {
    const result = {
      Sections: new Array(),
      Steels: new Array()
    };

    const RCOUNT = 100;
    const steps = 180 / RCOUNT;

    let olddeg = 0;
    for (let deg = steps; deg <= 180; deg += steps) {
      const section = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * h / 2, // 断面高さ
        WTop: b - h + Math.sin(this.Radians(olddeg)) * h, // 断面幅（上辺）
        WBottom: b - h + Math.sin(this.Radians(deg)) * h, // 断面幅（底辺
        ElasticID: 'c'                                    // 材料番号
      };
      result.Sections.push(section);
      olddeg = deg;
    }

    return result;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOval(b: number, h: number): any {
    const result = {
      Sections: new Array(),
      Steels: new Array()
    };

    const RCOUNT = 100;
    const steps = 180 / RCOUNT;

    let olddeg = 0;
    // 上側の曲線部
    for (let deg = steps; deg <= 90; deg += steps) {
      const section1 = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.Radians(olddeg)) * b,   // 断面幅（上辺）
        WBottom: Math.sin(this.Radians(deg)) * b,   // 断面幅（底辺
        ElasticID: 'c'                        // 材料番号
      };
      result.Sections.push(section1);
      olddeg = deg;
    }

    // 直線部
    const section2 = {
      Height: h - b,    // 断面高さ
      WTop: b,          // 断面幅（上辺）
      WBottom: b,       // 断面幅（底辺
      ElasticID: 'c'    // 材料番号
    };
    result.Sections.push(section2);

    // 下側の曲線部
    for (let deg = 90 + steps; deg <= 180; deg += steps) {
      const section3 = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.Radians(olddeg)) * b, // 断面幅（上辺）
        WBottom: Math.sin(this.Radians(deg)) * b, // 断面幅（底辺
        ElasticID: 'c'                            // 材料番号
      };
      result.Sections.push(section3);
      olddeg = deg;
    }
    return result;
  }

  // T形断面の POST 用 データ作成
  private getInvertedTsection(position: any, index: number): boolean {
    const SectionData = position.SectionData[index];

    // 断面情報を集計
    SectionData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.save.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.save.toNumber(position.memberInfo.t);
    if (bf === null && hf == null ) { 
      return this.getRectangle(position, index);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    SectionData.Sections.push(section2);

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    SectionData.Sections.push(section1);

    // コンクリートの材料情報を集計
    SectionData['SectionElastic'] = new Array();
    const fck = position.material_concrete.fck;
    const rc = position.safety_factor.rc;
    const ec = this.getEc(fck);
    const elastic = {
      fck: fck / rc,     // コンクリート強度
      Ec: ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    SectionData.SectionElastic.push(elastic);

    // 鉄筋情報を 集計
    const bars = this.getRectBar(position, SectionData.memo, h);
    if (bars !== null) {
      SectionData['Steels'] = bars.Steels;
      SectionData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    return true;
  }

  // T形断面の POST 用 データ作成
  private getTsection(position: any, index: number): boolean {
    const SectionData = position.SectionData[index];

    // 断面情報を集計
    SectionData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.save.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.save.toNumber(position.memberInfo.t);
    if (bf === null && hf == null ) { 
      return this.getRectangle(position, index);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    SectionData.Sections.push(section1);

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    SectionData.Sections.push(section2);

    // コンクリートの材料情報を集計
    SectionData['SectionElastic'] = new Array();
    const fck = position.material_concrete.fck;
    const rc = position.safety_factor.rc;
    const ec = this.getEc(fck);
    const elastic = {
      fck: fck / rc,      // コンクリート強度
      Ec: ec,             // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    SectionData.SectionElastic.push(elastic);

    // 鉄筋情報を 集計
    const bars = this.getRectBar(position, SectionData.memo, h);
    if (bars !== null) {
      SectionData['Steels'] = bars.Steels;
      SectionData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    return true;
  }

  // 矩形断面の POST 用 データ作成
  private getRectangle(position: any, index: number): boolean {
    const SectionData = position.SectionData[index];

    // 断面情報を集計
    SectionData['Sections'] = new Array();
    let height: number = this.save.toNumber(position.memberInfo.H);
    if (height === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      height += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }

    const section = {
      Height: height, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    SectionData.Sections.push(section);

    // コンクリートの材料情報を集計
    SectionData['SectionElastic'] = new Array();
    const fck = position.material_concrete.fck;
    const rc = position.safety_factor.rc;
    const ec = this.getEc(fck);
    const elastic = {
      fck: fck / rc,     // コンクリート強度
      Ec: ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    SectionData.SectionElastic.push(elastic);

    // 鉄筋情報を 集計
    const bars = this.getRectBar(position, SectionData.memo, height);
    if (bars !== null) {
      SectionData['Steels'] = bars.Steels;
      SectionData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    return true;
  }

  // 円環断面の POST 用 データ作成
  private getRing(b: number, h: number): any {
    const result = {
      Sections: new Array(),
      Steels: new Array()
    };
    const RCOUNT = 100;

    const x1: number = h / RCOUNT;
    const x3: number = (h - b) / 2;

    let b1 = 0;
    let b3 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2 = x1 * i;
      const x4 = x2 - x3;
      const b2 = this.getCircleWidth(h, x2);
      let b4: number;
      if (x2 < x3) {
        b4 = 0;
      } else if (x2 > x3 + b) {
        b4 = 0;
      } else {
        b4 = this.getCircleWidth(b, x4);
      }

      const section = {
        Height: x1,       // 断面高さ
        WTop: b1 - b3,    // 断面幅（上辺）
        WBottom: b2 - b4, // 断面幅（底辺）
        ElasticID: 'c'    // 材料番号
      };
      result.Sections.push(section);
      b1 = b2;
      b3 = b4;
    }
    return result;
  }

  // 円形断面の POST 用 データ作成
  private getCircle(position: any): boolean {
    const SectionData = position.SectionData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    SectionData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    const x1: number = h / RCOUNT;
    let b1 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2: number = x1 * i;
      const b2: number = this.getCircleWidth(h, x2);
      const section = {
        Height: x1,     // 断面高さ
        WTop: b1,       // 断面幅（上辺）
        WBottom: b2,    // 断面幅（底辺）
        ElasticID: 'c'  // 材料番号
      };
      SectionData.Sections.push(section);
      b1 = b2;
    }

    // コンクリートの材料情報を集計
    SectionData['SectionElastic'] = new Array();
    const fck = position.material_concrete.fck;
    const rc = position.safety_factor.rc;
    const ec = this.getEc(fck);
    const elastic = {
      fck: fck / rc,     // コンクリート強度
      Ec: ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    SectionData.SectionElastic.push(elastic);
    
    // 鉄筋情報を 集計
    const bars = this.getCircleBar(position);
    if (bars !== null) {
      SectionData['Steels'] = bars.Steels;
      SectionData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    return true;
  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2));

    return Math.abs(2 * c);

  }

    // 矩形 T形の 鉄筋のPOST用 データを登録する。
    private getCircleBar(position: any): any {
      const result = {
        Steels: new Array(),
        SteelElastic: new Array()
      };
  
      let barInfo: any = position.barData.rebar1;

      // 鉄筋径の入力が ない場合は スキップ
      if (this.save.toNumber(barInfo.rebar_dia) === null) {
        return result;
      }

      // 鉄筋の本数の入力が ない場合は スキップ
      let rebar_n = this.save.toNumber(barInfo.rebar_n);
      if (rebar_n === null) {
        return result;
      }

      // 1段当りの本数
      let line: number = this.save.toNumber(barInfo.rebar_lines);
      if (line === null) {
        line = rebar_n;
      }

      // 鉄筋段数
      const n: number = Math.ceil(line / rebar_n);

      // 鉄筋アキ
      let space: number = this.save.toNumber(barInfo.rebar_space);
      if (space === null) {
        space = 0;
      }

      // 鉄筋かぶり
      let dsc = this.save.toNumber(barInfo.rebar_cover);
      if (dsc === null) {
        dsc = 0;
      }

      // 鉄筋強度
      let fsy: number;
      if (barInfo.rebar_dia <= position.materialInfo[0].fsy1) {
        fsy = this.save.toNumber(position.materialInfo[1].fsy1);
      } else {
        fsy = this.save.toNumber(position.materialInfo[1].fsy2);
      }
      if (fsy === null) {
        return result;
      }

      // 鉄筋径
      let dia: string = 'D' + barInfo.rebar_dia;
      if (fsy === 235) {
        // 鉄筋強度が 235 なら 丸鋼
        dia = 'R' + barInfo.rebar_dia;
      }

      // 鉄筋配置
      let h: number = position.memberInfo.H;
      for( let i = 0; i < n; i++) { 
          
          const Rt: number = h - ((dsc + i * space) * 2);    // 鉄筋直径
          const steps: number = 360 / (rebar_n - line * i)                    '鉄筋角度間隔
          
          Dim deg As Single
          For deg = 0 To 360 Step steps
          
              Set Steel1 = New clsSteel
              With Steel1
                  .depth = (Rt / 2) - (Math.Cos(Radians(deg)) * Rt / 2) + bars(i).depth  '深さ位置
                  .i = bars(i).i                      '鋼材
                  .n = 1                              '鋼材の本数
                  If deg >= 135 And deg <= 225 Then   '鋼材の引張降伏着目Flag
                      .IsTensionBar = True
                  Else
                      .IsTensionBar = False
                  End If
                  .ElasticID = "s"            '材料番号
              End With
              Call InputData.steels.Add(Steel1)
          Next deg
          
      }




      const tensionBarList: any[] = this.getCompresBar(tensionBar, position.material_steel);
      // 有効な入力がなかった場合は null を返す.
      if (tensionBarList.length < 1) {
        return null;
      }
  
      // 圧縮鉄筋 と 側方鉄筋 をセットする
      let sideBarList: any[] = new Array();
      let compresBarList: any[] = new Array();
  
      if (position.safety_factor.range >= 2) {
        compresBarList = this.getCompresBar(compresBar, position.material_steel);
      }
      if (position.safety_factor.range >= 3) {
        sideBarList = this.getSideBar(sideBar, position.material_steel, side, height);
      }
  
      // 基準となる 鉄筋強度
      const fsyk = tensionBarList[0].fsyk;
      const rs = position.safety_factor.rs;
  
      // 鉄筋強度の入力
      result.SteelElastic.push({
        fsk: fsyk / rs,
        Es: 200,
        ElasticID: 's'
      });
  
      // 圧縮鉄筋の登録
      for (const Asc of compresBarList) {
        Asc.n = Asc.n * Asc.fsyk / fsyk;
        result.Steels.push(Asc);
      }
  
      // 側面鉄筋の登録
      for (const Ase of sideBarList) {
        Ase.n = Ase.n * Ase.fsyk / fsyk;
        result.Steels.push(Ase);
      }
  
      // 引張鉄筋の登録
      for (const Ast of tensionBarList) {
        Ast.depth = height - Ast.depth;
        result.Steels.push(Ast);
      }
  
      return result;
    }

  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  private getRectBar(position: any, side: string, height: number): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };

    let tensionBar: any;
    let compresBar: any;

    switch (side) {
      case '上側引張':
        tensionBar = position.barData.rebar1;
        compresBar = position.barData.rebar2;
        break;
      case '下側引張':
        tensionBar = position.barData.rebar2;
        compresBar = position.barData.rebar1;
        break;
    }
    const sideBar = position.barData.sidebar;

    const tensionBarList: any[] = this.getCompresBar(tensionBar, position.material_steel);
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }

    // 圧縮鉄筋 と 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    let compresBarList: any[] = new Array();

    if (position.safety_factor.range >= 2) {
      compresBarList = this.getCompresBar(compresBar, position.material_steel);
    }
    if (position.safety_factor.range >= 3) {
      sideBarList = this.getSideBar(sideBar, position.material_steel, side, height);
    }

    // 基準となる 鉄筋強度
    const fsyk = tensionBarList[0].fsyk;
    const rs = position.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsyk / rs,
      Es: 200,
      ElasticID: 's'
    });

    // 圧縮鉄筋の登録
    for (const Asc of compresBarList) {
      Asc.n = Asc.n * Asc.fsyk / fsyk;
      result.Steels.push(Asc);
    }

    // 側面鉄筋の登録
    for (const Ase of sideBarList) {
      Ase.n = Ase.n * Ase.fsyk / fsyk;
      result.Steels.push(Ase);
    }

    // 引張鉄筋の登録
    for (const Ast of tensionBarList) {
      Ast.depth = height - Ast.depth;
      result.Steels.push(Ast);
    }

    return result;
  }

  // 矩形。Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any, materialInfo: any[]): any[] {
    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.rebar_dia) === null) {
      return new Array();
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.save.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      return new Array();
    }

    // 1段当りの本数
    let line: number = this.save.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const n: number = Math.ceil(line / rebar_n);

    // 鉄筋アキ
    let space: number = this.save.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.save.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }

    // 鉄筋強度
    let fsy: number;
    if (barInfo.rebar_dia <= materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[1].fsy1);
    } else {
      fsy = this.save.toNumber(materialInfo[1].fsy2);
    }
    if (fsy === null) {
      return new Array();
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.rebar_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.rebar_dia;
    }

    // 鉄筋情報を登録
    for (let i = 0; i < n; i++) {
      const Steel1 = {
        depth: dsc + i * space,
        i: dia,
        n: Math.min(line, rebar_n),
        IsTensionBar: false,
        ElasticID: 's',
        fsyk: fsy
      };
      result.push(Steel1)
      rebar_n = rebar_n - line;
    }
    return result;
  }

  // 矩形。Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar(barInfo: any, materialInfo: any[], side: string, height: number): any[] {
    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.side_dia) === null) {
      return new Array();
    }
    // 鉄筋段数
    const n = barInfo.sidebar_n;
    if (this.save.toNumber(n) === null) {
      return new Array(); // 鉄筋段数の入力が ない場合は スキップ
    }
    if (n === 0) {
      return new Array(); // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.save.toNumber(space) === null) {
      space = height / (n + 1);
    }

    // 鉄筋かぶり
    let dse = barInfo.side_cover;
    if (this.save.toNumber(dse) === null) {
      dse = space;
    }
    if (side === '上側引張') {
      dse = height - dse;
    }

    // 1段当りの本数
    const line = 2;

    // 鉄筋強度
    let fsy: number;
    if (barInfo.side_dia < materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[2].fsy1);
    } else {
      fsy = this.save.toNumber(materialInfo[2].fsy2);
    }
    if (fsy === null) {
      return new Array();
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.side_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.side_dia;
    }

    // 鉄筋情報を登録
    for (let i = 0; i < n; i++) {
      const Steel1 = {
        depth: dse + i * space,
        i: dia,
        n: line,
        IsTensionBar: false,
        ElasticID: 's',
        fsyk: fsy
      };
      result.push(Steel1)
    }
    return result;
  }

  // 鉄筋の入力情報を セット
  private setBarData(g_no: number, m_no: number, position: any): any {

    const temp = this.save.bars.getBarsColumns();
    const barList = temp.find(function (value) {
      return (value[0].g_no === g_no);
    });
    if (barList === undefined) {
      console.log('部材グループが存在しない')
      position.SectionData = new Array();
      return;
    }

    const startFlg: boolean[] = [false, false];
    let barData: object = null;
    for (let i = barList.length - 1; i >= 0; i--) {
      // 同じ部材番号を探す
      if (barList[i].positions.length < 1) { continue; }
      if (startFlg[0] === false) {
        if (barList[i].positions[0].m_no === m_no) {
          startFlg[0] = true;
        } else {
          continue;
        }
      }

      // 同じ着目点位置を探す
      for (let j = barList[i].positions.length - 1; j >= 0; j--) {
        const bar = barList[i].positions[j];
        if (startFlg[1] === false) {
          if (bar.index === position.index) {
            startFlg[1] = true;
          } else {
            continue;
          }
        }
        // 鉄筋情報を集計
        if (barData === null) {
          barData = bar;
        } else {
          this.setBarObjectValue(barData, bar);
        }
      }
    }

    position['barData'] = barData;
  }

  // 連想配列の null の要素をコピーする
  private setBarObjectValue(target: object, obj: object): void {
    try {
      for (const key of Object.keys(obj)) {
        if (obj[key] === undefined) { continue; }
        if (obj[key] === null) { continue; }
        if (key === 'haunch_M') { continue; }
        if (key === 'haunch_V') { continue; }
        if (key === 'tan') { continue; }
        if (key === 'b') { continue; }
        if (key === 'h') { continue; }
        if (key === 'm_no') { continue; }
        if (key === 'p_name') { continue; }
        if (key === 'p_name_ex') { continue; }
        if (key === 'position') { continue; }
        if (key === 'index') { continue; }
        if (key === 'title') { continue; }
        if (key === 'cos') { continue; }
        if (key === 'enable') { continue; }

        if (typeof obj[key] === 'object') {
          this.setBarObjectValue(target[key], obj[key]);
        } else {
          if (target[key] === null) {
            target[key] = obj[key];
          }
        }
      }
    } catch {
      console.log('aa');
    }
  }

  // 角度をラジアンに変換
  private Radians(degree: number) {
    return degree * (Math.PI / 180);
  }


  // コンクリート強度から弾性係数を 返す
  private getEc(fck: number) {

    const EcList: number[] = [22, 25, 28, 31, 33, 35, 37, 38];
    const fckList: number[] = [18, 24, 30, 40, 50, 60, 70, 80];

    let i: number;
    const j: number = fckList.length - 1;

    let x1: number;
    let x2: number;
    let y1: number;
    let y2: number;
    if (fckList[0] >= fck) {
      x1 = fckList[0];
      x2 = fckList[1];
      y1 = EcList[0];
      y2 = EcList[1];
    } else if (fckList[j] <= fck) {
      i = j;
    } else {
      for (i = 0; i < fckList.length; i++) {
        if (fckList[i] >= fck) {
          break;
        }
      }
      x1 = fckList[i - 1];
      x2 = fckList[i];
      y1 = EcList[i - 1];
      y2 = EcList[i];
    }
    return y2 + (x2 - fck) * (y1 - y2) / (x2 - x1);
  }

}
