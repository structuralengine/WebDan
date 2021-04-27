import { Injectable } from '@angular/core';
import { InputSafetyFactorsMaterialStrengthsService } from '../components/safety-factors-material-strengths/safety-factors-material-strengths.service';

@Injectable({
  providedIn: 'root'
})
export class SetSafetyFactorService {

  private isAlert: boolean; // 一度も警告を出したことがあるか？
  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService) {
    this.isAlert = false;
  }

  // position.PostData0 に安全係数情報を追加する ///////////////////////////////////////////////////////
  public setSafetyFactor(calcTarget: string, g_id: string, position: any, tableIndex: number): void {

    const safetyList = this.safety.getSafetyFactor(g_id);
    if (safetyList === undefined) {
      console.log('安全係数がないので計算できません');
      if (this.isAlert === false) {
        alert('安全係数がないので計算できません');
        this.isAlert = true;
      }
      let i: number = 0;
      while ('PostData' + i.toString() in position) {
        position['PostData' + i.toString()] = new Array();
        i++;
      }
      return;
    }

    // 安全係数 を代入する
    let safety_factor;
    switch (calcTarget) {
      case 'Md': // 曲げモーメントの照査の場合
        safety_factor = {
          rc: safetyList.safety_factor[tableIndex].M_rc,
          rs: safetyList.safety_factor[tableIndex].M_rs,
          rb: safetyList.safety_factor[tableIndex].M_rbs,
          ri: safetyList.safety_factor[tableIndex].ri,
          range: safetyList.safety_factor[tableIndex].range
        };

        break;
      case 'Vd': // せん断力の照査の場合
        safety_factor = {
          rc: safetyList.safety_factor[tableIndex].V_rc,
          rs: safetyList.safety_factor[tableIndex].V_rs,
          rbc: safetyList.safety_factor[tableIndex].V_rbc,
          rbs: safetyList.safety_factor[tableIndex].V_rbs,
          rbd: safetyList.safety_factor[tableIndex].V_rbv,
          ri: safetyList.safety_factor[tableIndex].ri,
          range: safetyList.safety_factor[tableIndex].range
        };
        break;
    }
    if (safety_factor.rc === null || safety_factor.rs === null) {
      console.log("安全係数がないので計算対象外")
      let i = 0;
      while ('PostData' + i.toString() in position) {
        position['PostData' + i.toString()] = new Array();
        i++;
      }
      return;
    }


    position['safety_factor'] = safety_factor; // 安全係数

    // 材料強度 を代入する
    position['material_bar'] = safetyList.material_bar; // 鉄筋強度
    position['material_concrete'] = safetyList.material_concrete; // コンクリート強度

    // 杭の施工条件
    let pile_factor = this.safety.getPileFactor( g_id);
    if (pile_factor === undefined) {
      pile_factor = safetyList.pile_factor_list[0];
    }
    position['pile_factor'] = pile_factor;

  }

}
