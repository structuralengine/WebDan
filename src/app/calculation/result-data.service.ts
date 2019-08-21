import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(private save: SaveDataService) {
  }

  // 断面力一覧を取得
  public getDesignForceList(type: string): any[] {

    let result: any[];
    if (this.save.isManual() === true) {
      result = this.getDesignForceFromManualInput(type);
    } else {
      result = this.getDesignForceFromPickUpData(type);
    }
    return result;
  }

  // 断面力手入力情報から断面力一覧を取得
  private getDesignForceFromManualInput(type: string): any[] {
    return new Array();
  }

  // ピックアップデータから断面力一覧を取得
  private getDesignForceFromPickUpData(type: string): any[] {

    // ピックアップNo を取得
    const pickupNoList: any[] = this.save.basic.getPickUpNo(type);
    if (pickupNoList.length === 0) { return new Array(); }

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(pickupNoList[0]); // 複製

    // 断面力を取得
    const force: object = this.save.pickup_data;

    for (let i = 1; i < pickupNoList.length; i++) {
      const pickupNo: string = 'pickUpNo:' + pickupNoList[i];
      if (pickupNo in force === false) {
        return new Array(); // ピックアップ番号の入力が不正
      }
      const targetForce = force[pickupNo];

      for (const groupe of result) {
        for (const member of groupe) {
          const targetMember = targetForce.find(function (value) {
            return (value.m_no === member.m_no);
          });
          if (targetMember === undefined) {
            return new Array(); // 存在しない要素番号がある
          }

          for (const positions of member.positions) {
            const targetPosition = targetMember.positions.find(function (value) {
              return (value.position === positions.position);
            });
            if (targetPosition === undefined) {
              return new Array(); // 存在しない着目点がある
            }
            if ('designForce' in positions === false) {
              positions['designForce'] = new Array();
            }
            const designForce = {
              Mmax: targetPosition['M'].max,
              Mmin: targetPosition['M'].min,
              Smax: targetPosition['S'].max,
              Smin: targetPosition['S'].min,
              Nmax: targetPosition['N'].max,
              Nmin: targetPosition['N'].min
            };
            positions['designForce'].push(designForce);
          }
        }
      }

    }

    return result;
  }

  // 計算対象の着目点のみを抽出する
  private getEnableMembers(calcTarget: string): any[] {
    const temp: any[] = this.save.points.getDesignPointColumns();
    const result = temp.slice(0, temp.length); // 複製
    // 計算対象ではない着目点を削除する
    let groupe_delete_flug: boolean = true;
    while (groupe_delete_flug) {
      groupe_delete_flug = false;

      for (let i = 0; i < result.length; i++) {
        const groupe = result[i];

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

}
