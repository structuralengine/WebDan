import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(private save: SaveDataService) {
  }

  // 断面力一覧を取得
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

  // position.SectionData に安全係数情報を追加する
  public setSafetyFactor(g_no: number, position: any, tableIndex: number): void {

    const safetyList = this.save.safety.safety_factor_material_strengths_list.find(function (value) {
      return value.g_no === g_no;
    });
    if (safetyList === undefined) {
      console.log("安全係数がないので計算対象外")
      position.SectionData = new Array();
      return;
    }

    // 安全係数・材料強度 を代入する
    position['safety_factor'] = safetyList.safety_factor[tableIndex]; // 安全係数
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

  // position に 鉄筋情報を入力する
  public setSectionData(m_no: number, position: any): void {

    // 部材・断面情報を探す //////////////////////////////////////////////////////
    const memberInfo = this.save.members.member_list.find(function (value) {
      return (value.m_no === m_no);
    });
    if (memberInfo === undefined) {
      console.log('部材番号が存在しない');
      position.SectionData = new Array();
      return;
    }


    // POST 用の断面情報をセット
    if (memberInfo.shape.indexOf('円形') > 0) {
      // 円形の場合は 上側引張、下側引張　どちらかにする
      if (position.SectionData.length > 1) {
        if (Math.abs(position.SectionData[0]) > Math.abs(position.SectionData[1])) {
          position.SectionData.pop(); // 末尾の要素を取り除く
        } else {
          position.SectionData.shift(); // 先頭の要素を取り除く
        }
      }
      position.SectionData[0]['Sections'] = this.getCircle(memberInfo.H);
    } else if (memberInfo.shape.indexOf('矩形') > 0) {

    } else if (memberInfo.shape.indexOf('Ｔ形') > 0) {
      // T形 断面の上側引張は 矩形

    } else if (memberInfo.shape.indexOf('逆Ｔ形') > 0) {

    } else if (memberInfo.shape.indexOf('小判形') > 0) {

    } else if (memberInfo.shape.indexOf('円環') > 0) {

    } else {
      console.log("断面形状：" + memberInfo.shape + " は適切ではありません。");
      position.SectionData = new Array();
      return;
    }

    position['memberInfo'] = memberInfo;
  }



  // 円形断面の POST 用 データ作成
  private getCircle(h: number): any[] {
    const result: any[] = new Array();

    const RCOUNT: number = 100;

    const x1: number = h / RCOUNT;
    let b1: number = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2: number = x1 * i;
      const b2: number = this.getCircleWidth(h, x2)
      const section = {
        Height: x1,    // 断面高さ 
        WTop: b1,       //断面幅（上辺）
        WBottom: b2,    //断面幅（底辺）
        ElasticID: "c" //材料番号
      }
      result.push(section);
      b1 = b2;
    }
    return result;
  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;
    const b = a - x

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2))

    return Math.abs(2 * c);

  }

  // position に 鉄筋情報を入力する
  public setBars(g_no: number, m_no: number, position: any): void {

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

  // 
  public setPostData(position: any): void {

    // 鉄筋の本数・断面形状を入力する //////////////////////////////////////////////////////
    for (const target of position.SectionData) {

      // 断面形状を入力する
      // memberInfo = {
      //   'm_no': id, 'm_len': null, 'g_no': null, 'g_name': null, 'shape': '',
      //   'B': null, 'H': null, 'Bt': null, 't': null,
      //   'con_u': null, 'con_l': null, 'con_s': null,
      //   'vis_u': false, 'vis_l': false, 'ecsd': null, 'kr': null,
      //   'r1_1': null, 'r1_2': null, 'r1_3': null, 'n': null
      // }
      const rc = target.safety_factor.M_rc;
      const fck = target.material_concrete.fck / rc;
      const Ec = this.getEc(fck);

      const FrameWebPostData = {
        Md: Math.abs(target.Md),
        Nd: target.Nd,
        Sections: [],
        SectionElastic: [{
          fck: fck,
          Ec: Ec,
          ElasticID: 'C'
        }],
        Steels: [{

        }],
        SteelElastic: [{
          fsk: 345,
          Es: 200,
          ElasticID: 'S'
        }]
      };
      // 鉄筋の本数を入力する
      switch (target.memo) {
        case '上側引張':
          break;
        case '下側引張':
          break;
      }

    }
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
