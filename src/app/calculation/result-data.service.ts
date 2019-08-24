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

  // 鉄筋の本数・断面形状を入力する
  public setSections(g_no: number, m_no: number, position: any): void {

    // 部材・断面情報を探す //////////////////////////////////////////////////////
    const memberInfo = this.save.members.member_list.find(function (value) {
      return (value.m_no === m_no);
    });
    if (memberInfo === undefined) {
      position.SectionData = new Array();
      return; // 部材番号が存在しない
    }

    // 鉄筋配置情報を探す //////////////////////////////////////////////////////
    const temp = this.save.bars.getBarsColumns();
    const barList = temp.find(function (value) {
      return (value[0].g_no === g_no);
    });
    if (barList === undefined) {
      position.SectionData = new Array();
      return; // 部材グループが存在しない
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
        "Md": Math.abs(target.Md),
        "Nd": target.Nd,
        "Sections": [],
        "SectionElastic": [{
          "fck": fck,
          "Ec": Ec,
          "ElasticID": 'C'
        }],
        "Steels": [{

        }],
        "SteelElastic": [{
          "fsk": ,
          "Es": 200,
          "ElasticID": 'S'
        }]
      }
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
