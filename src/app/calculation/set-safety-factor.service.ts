import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class SetSafetyFactorService {

  constructor(private save: SaveDataService) {
  }

  // position.PostData0 に安全係数情報を追加する ///////////////////////////////////////////////////////
  public setSafetyFactor(calcTarget: string, g_no: number, position: any, tableIndex: number): void {

    const safetyList = this.save.safety.safety_factor_material_strengths_list.find(function (value) {
      return value.g_no === g_no;
    });
    if (safetyList === undefined) {
      console.log("安全係数がないので計算対象外")
      let i: number = 0;
      while ('PostData' + i.toString() in position) {
        position['PostData' + i.toString()] = new Array();
        i++;
      }
      return;
    }

    // 安全係数 を代入する
    let safety_factor: object;
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
    position['safety_factor'] = safety_factor; // 安全係数

    // 材料強度 を代入する
    position['material_bar'] = safetyList.material_bar; // 鉄筋強度
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

}
