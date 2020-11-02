import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class SetDesignForceService {


  constructor(private save: SaveDataService) {
  }

  // 断面力一覧を取得 ////////////////////////////////////////////////////////////////
  public getDesignForceList(calcTarget: string, pickupNo: number): any[] {

    if (this.save.toNumber(pickupNo) === null) {
      return new Array();
    }
    let result: any[];
    if (this.save.isManual() === true) {
      result = this.getDesignForceFromManualInput(calcTarget, pickupNo);
    } else {
      result = this.getDesignForceFromPickUpData(calcTarget, pickupNo);
    }
    return result;
  }

  // 断面力手入力情報から断面力一覧を取得
  private getDesignForceFromManualInput(calcTarget: string, pickupNo: number): any[] {

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(calcTarget);

    // 断面力を取得
    let force: any[];
    switch (calcTarget) {
      case 'Md': // 曲げモーメントの照査の場合
        force = this.save.force.Mdatas;
        break;
      case 'Vd': // せん断力の照査の場合
        force = this.save.force.Vdatas;
        break;
    }

    if (force === undefined) {
      return new Array(); // 断面力がない
    }

    // 断面力を追加
    for (const groupe of result) {
      for (const member of groupe) {
        const targetMember = force.find((value) => {
          return (value.m_no === member.m_no);
        });
        if (targetMember === undefined) {
          return new Array(); // 存在しない要素番号がある
        }
        for (const position of member.positions) {

          if (targetMember.case.length < pickupNo) {
            return new Array(); // ピックアップ番号の入力が不正
          }
          // 奥行き本数
          let n: number = this.save.toNumber(member.n);
          if (n === null) { n = 1; }
          if (n === 0) { n = 1; }

          const targetForce = targetMember.case[pickupNo];

          if ('designForce' in position === false) {
            position['designForce'] = new Array();
          }

          for (const key of Object.keys(targetForce)) {
            let value: number = this.save.toNumber(targetForce[key]);
            if (value === null) { value = 0; }
            targetForce[key] = value;
          }

          const designForce = {
            Manual: targetForce,
            n: n
          };

          position['designForce'].push(designForce);
        }
      }
    }

    return result;
  }

  // ピックアップデータから断面力一覧を取得
  private getDesignForceFromPickUpData(calcTarget: string, pickupNo: number): any[] {

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(calcTarget);

    // 断面力を取得
    const force: object = this.save.pickup_data;

    // 断面力を追加
    const pickupStr: string = 'pickUpNo:' + pickupNo;
    if (pickupStr in force === false) {
      return new Array(); // ピックアップ番号の入力が不正
    }
    const targetForce = force[pickupStr];

    for (const groupe of result) {
      for (const member of groupe) {
        const targetMember = targetForce.find((value) => {
          return (value.memberNo === member.m_no);
        });
        if (targetMember === undefined) {
          return new Array(); // 存在しない要素番号がある
        }
        // 奥行き本数
        let n: number = this.save.toNumber(member.n);
        if (n === null) { n = 1; }
        if (n === 0) { n = 1; }

        for (const position of member.positions) {
          const targetPosition = targetMember.positions.find((value) => {
            return (value.index === position.index);
          });
          if (targetPosition === undefined) {
            return new Array(); // 存在しない着目点がある
          }
          if ('designForce' in position === false) {
            position['designForce'] = new Array();
          }

          let mKey1: string = 'my';
          let mKey2: string = 'Mdy';
          if (position.isMzCalc === true) {
            mKey1 = 'mz';
            mKey2 = 'Mdz';
          } else if (position.isVzCalc === true) {
            mKey1 = 'mz';
            mKey2 = 'Mdz';
          }

          let vKey1: string = 'fy';
          let vKey2: string = 'Vdy';
          if (position.isVzCalc === true) {
            vKey1 = 'fz';
            vKey2 = 'Vdz';
          } else if (position.isMzCalc === true) {
            vKey1 = 'fz';
            vKey2 = 'Vdz';
          }

          let temp = {
            Mdmax: 0,
            Mdmin: 0,
            Vdmax: 0,
            Vdmin: 0,
            Ndmax: 0,
            Ndmin: 0
          }
          if (!( mKey1 in targetPosition )) {
            temp = {
              Mdmax: targetPosition['M'].max,
              Mdmin: targetPosition['M'].min,
              Vdmax: targetPosition['S'].max,
              Vdmin: targetPosition['S'].min,
              Ndmax: targetPosition['N'].max,
              Ndmin: targetPosition['N'].min
            };
          } else {
            temp = {
              Mdmax: targetPosition[mKey1].max,
              Mdmin: targetPosition[mKey1].min,
              Vdmax: targetPosition[vKey1].max,
              Vdmin: targetPosition[vKey1].min,
              Ndmax: targetPosition['fx'].max,
              Ndmin: targetPosition['fx'].min
            };
          }

          const designForce = { n };

          for (const key of Object.keys(temp)) {
            const tmp = temp[key];
            designForce[key] = {
              comb: tmp.comb,
              Md: tmp[mKey2],
              Nd: tmp.Nd,
              Vd: tmp[vKey2]
            };
          }

          position['designForce'].push(designForce);
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
    for (let i = result.length - 1; i >= 0; i--) {
      // 計算・印刷画面の部材にチェックが入っていなかければ削除
      if (this.save.calc.calc_checked[i] === false) {
        result.splice(i, 1);
        continue;
      }

      const groupe = result[i];
      for (let j = groupe.length - 1; j >= 0; j--) {

        const positions: any[] = groupe[j].positions;
        let maxFlag: boolean = false;

        for (const pos of positions) {

          if (maxFlag === true) {
            pos['enable'] = maxFlag;
          } else {
            switch (calcTarget) {
              case 'Md':  // 曲げモーメントの照査の場合
                pos['enable'] = (pos.isMyCalc === true || pos.isMzCalc === true);
                break;
              case 'Vd': // せん断力の照査の場合
                pos['enable'] = (pos.isVyCalc === true || pos.isVzCalc === true);
                break;
            }
          }

          const p_name_ex: string = (pos.p_name_ex === null) ? '' : pos.p_name_ex.toString().toUpperCase();

          if (pos.enable === true && p_name_ex.indexOf('MAX') >= 0) {
            // 着目点名(p_name_ex) に MAX というキーワードが入っていたら END まで対象とする
            maxFlag = true;
          }

          pos['isMax'] = maxFlag;  // MAX 区間中は isMaxフラグを付ける

          if (p_name_ex.indexOf('END') >= 0) {
            maxFlag = false;
          }


        }

        // 不要なポジションを削除する
        for (let k = positions.length - 1; k >= 0; k--) {
          if (positions[k].enable === false) {
            positions.splice(k, 1);
          } else {
            delete positions[k].enable;
          }
        }

        // 照査する着目点がなければ 対象部材を削除
        if (positions.length === 0) {
          groupe.splice(j, 1);
        }

      }

      // 照査する部材がなければ 対象グループを削除
      if (groupe.length === 0) {
        result.splice(i, 1);
      }

    }

    return result;
  }
}
