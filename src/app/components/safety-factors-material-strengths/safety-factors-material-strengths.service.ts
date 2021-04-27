import { Injectable } from '@angular/core';
import { InputBasicInformationService } from '../basic-information/basic-information.service';
import { InputMembersService } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class InputSafetyFactorsMaterialStrengthsService {

  private safety_factor: any;
  private material_bar: any;
  private material_steel: any;
  private material_concrete: any;
  private pile_factor: any;

  constructor(
    private basic: InputBasicInformationService,
    private members: InputMembersService) {
    this.clear();
  }
  public clear(): void {
    this.safety_factor = {};
    this.material_bar = {};
    this.material_steel = {};
    this.material_concrete = {};
    this.pile_factor = {};
  }

  // 材料強度情報
  /// specification1_selected によって変わる項目の設定
  private default_safety_factor(): any {

    let result: any;

    switch (this.basic.get_specification1()) {
      case 0: // 鉄道

        result = [
          {
            id: 0, title: '耐久性, 使用性',
            M_rc: 1.00, M_rs: 1.00, M_rbs: 1.00,
            V_rc: 1.00, V_rs: 1.00, V_rbc: 1.00, V_rbs: 1.00, V_rbv: null,
            ri: 1.00, range: 1,
            S_rs: 1.0, S_rb: 1.0
          },
          {
            id: 2, title: '安全性 （疲労破壊）',
            M_rc: 1.30, M_rs: 1.05, M_rbs: 1.10,
            V_rc: 1.30, V_rs: 1.05, V_rbc: 1.30, V_rbs: 1.10, V_rbv: null,
            ri: 1.10, range: 2,
            S_rs: 1.0, S_rb: 1.1
          },
          {
            id: 5, title: '安全性 （破壊）',
            M_rc: 1.30, M_rs: 1.05, M_rbs: 1.10,
            V_rc: 1.30, V_rs: 1.05, V_rbc: 1.30, V_rbs: 1.10, V_rbv: null,
            ri: 1.10, range: 2,
            S_rs: 1.0, S_rb: 1.1
          },
          {
            id: 6, title: '復旧性 （損傷）地震時以外',
            M_rc: 1.30, M_rs: 1.00, M_rbs: 1.10,
            V_rc: 1.30, V_rs: 1.00, V_rbc: 1.30, V_rbs: 1.10, V_rbv: 1.20,
            ri: 1.20, range: 3,
            S_rs: 1.05, S_rb: 1.1
          },
          {
            id: 7, title: '復旧性 （損傷）地震時',
            M_rc: 1.30, M_rs: 1.00, M_rbs: 1.00,
            V_rc: 1.30, V_rs: 1.00, V_rbc: 1.30, V_rbs: 1.00, V_rbv: 1.20,
            ri: 1.00, range: 3,
            S_rs: 1.05, S_rb: 1.1
          }
        ]

        break;

      case 1: // 道路
        result = new Array();
        break;
    }

    return result;

  }

  // 材料強度情報
  public default_material_bar(): any {
    const result = [
      {
        separate: 25,
        tensionBar: { fsy: 345, fsu: 490 },
        sidebar: { fsy: 345, fsu: 490 },
        stirrup: { fsy: 345, fsu: 490 }
      },
      {
        separate: 29,
        tensionBar: { fsy: 345, fsu: 490 },
        sidebar: { fsy: 345, fsu: 490 },
        stirrup: { fsy: 345, fsu: 490 }
      }
    ]
    return result;
  }

  // 材料強度情報
  public default_material_steel(): any {
    const result = [
      {
        separate: 16,
        fsyk: 245,
        fsvyk: 140,
        fsuk: 400,
      },
      {
        separate: 40,
        fsyk: 235,
        fsvyk: 135,
        fsuk: 400,
      },
      {
        separate: 75,
        fsyk: 215,
        fsvyk: 125,
        fsuk: 400,
      }
    ];
    return result;
  }

  public default_material_concrete(): any {
    const result = {
      fck: 24,
      dmax: 25
    };
    return result;
  }

  // 杭の施工係数
  public default_pile_factor(): any {

    let result = [];

    switch (this.basic.get_specification1()) {
      case 0: // 鉄道
      result = [
          { id: 'pile-000', title: '使用しない', rfck: 1.0, rfbok: 1.0, rEc: 1.0, rVcd: 1.0, selected: false },
          { id: 'pile-001', title: '泥水比重1.04以下', rfck: 0.8, rfbok: 0.7, rEc: 0.8, rVcd: 0.9, selected: false },
          { id: 'pile-002', title: '自然泥水, 泥水比重1.10以下', rfck: 0.7, rfbok: 0.6, rEc: 0.8, rVcd: 0.9, selected: false },
          { id: 'pile-003', title: 'ベントナイト泥水', rfck: 0.6, rfbok: 0.5, rEc: 0.7, rVcd: 0.8, selected: false },
          { id: 'pile-004', title: '気中施工', rfck: 0.9, rfbok: 0.9, rEc: 0.9, rVcd: 1.0, selected: false },
        ];
        break;

      case 1: // 道路
      result = new Array();

        break;
    }
    return result;
  }

  // component で使う用
  // 部材グループ別に並べている
  public getTableColumns(): any {
    
    const groupe_list = this.members.getGroupeList();
    const safety_factor = {};
    const material_bar = {};
    const material_steel = {};
    const material_concrete = {};
    const pile_factor = {};

    for (const groupe of groupe_list) {

      const tmp_safety_factor = this.default_safety_factor();
      const tmp_material_bar = this.default_material_bar();
      const tmp_material_steel = this.default_material_steel();
      const tmp_material_concrete = this.default_material_concrete();
      const tmp_pile_factor = this.default_pile_factor();

      const old_safety_factor = this.getSafetyFactor(groupe.g_id);
      if (old_safety_factor !== undefined) {
        for (const tmp of tmp_safety_factor) {
          const old = old_safety_factor.find(v => v.id === tmp.id)
          if (old !== undefined) {
            for (const key of Object.keys(tmp)) {
              if (key in old) { tmp[key] = old[key]; }
            }
          }
        }
      }

      const old_material_bar = this.material_bar.find(v => v.g_id === groupe.g_id);
      if (old_material_bar !== undefined) {
        for (let i = 0; i < tmp_material_bar.length; i++) {
          const tmp = tmp_material_bar[i];
          const old = old_material_bar[i];
          for (const key of Object.keys(tmp)) {
            if (key in old) { tmp[key] = old[key]; }
          }
        }
      }

      const old_material_steel = this.material_steel.find(v => v.g_id === groupe.g_id);
      if (old_material_steel !== undefined) {
        for (let i = 0; i < tmp_material_steel.length; i++) {
          const tmp = tmp_material_steel[i];
          const old = old_material_steel[i];
          for (const key of Object.keys(tmp)) {
            if (key in old) { tmp[key] = old[key]; }
          }
        }
      }

      const old_material_concrete = this.material_concrete.find(v => v.g_id === groupe.g_id);
      if (old_material_concrete !== undefined) {
        for (const key of Object.keys(tmp_material_concrete)) {
          if (key in old_material_concrete) {
            tmp_material_concrete[key] = old_material_concrete[key];
          }
        }
      }

      const old_pile_factor = this.getPileFactor(groupe.g_id);
      if (old_pile_factor !== undefined) {
        for (let i = 0; i < tmp_pile_factor.length; i++) {
          const tmp = tmp_pile_factor[i];
          const old = old_pile_factor[i];
          for (const key of Object.keys(tmp)) {
            if (key in old) { tmp[key] = old[key]; }
          }
        }
      }
      safety_factor[groupe.g_id] = tmp_safety_factor;
      material_bar[groupe.g_id] = tmp_material_bar
      material_steel[groupe.g_id] = tmp_material_steel;
      material_concrete[groupe.g_id] = tmp_material_concrete;
      pile_factor[groupe.g_id] = tmp_pile_factor;

    }

    return {
      groupe_list,
      safety_factor,
      material_bar,
      material_steel,
      material_concrete,
      pile_factor
    };

  }

  public getSafetyFactor(g_id): any{
    return this.safety_factor.find(v => v.g_id === g_id);
  }

  public getPileFactor(g_id) : any {
    return this.pile_factor.find(v => v.g_id === g_id);
  };

  public setSaveData(safety: any): void {

    this.clear();

    for (const groupe of safety) {

      const tmp_safety_factor = this.default_safety_factor();
      const tmp_material_bar = this.default_material_bar();
      const tmp_material_steel = this.default_material_steel();
      const tmp_material_concrete = this.default_material_concrete();
      const tmp_pile_factor = this.default_pile_factor();

      const new_safety_factor = safety.safety_factor.find(v => v.g_id === groupe.g_id);
      if (new_safety_factor !== undefined) {
        for (const tmp of tmp_safety_factor) {
          const org = new_safety_factor.find(v => v.id === tmp.id)
          if (org !== undefined) {
            for (const key of Object.keys(tmp)) {
              if (key in org) { tmp[key] = org[key]; }
            }
          }
        }
      }

      const new_material_bar = safety.material_bar.find(v => v.g_id === groupe.g_id);
      if (new_material_bar !== undefined) {
        for (let i = 0; i < tmp_material_bar.length; i++) {
          const tmp = tmp_material_bar[i];
          const org = new_material_bar[i];
          for (const key of Object.keys(tmp)) {
            if (key in org) { tmp[key] = org[key]; }
          }
        }
      }

      const new_material_steel = safety.material_steel.find(v => v.g_id === groupe.g_id);
      if (new_material_steel !== undefined) {
        for (let i = 0; i < tmp_material_steel.length; i++) {
          const tmp = tmp_material_steel[i];
          const org = new_material_steel[i];
          for (const key of Object.keys(tmp)) {
            if (key in org) { tmp[key] = org[key]; }
          }
        }
      }

      const new_material_concrete = safety.material_concrete.find(v => v.g_id === groupe.g_id);
      if (new_material_concrete !== undefined) {
        for (const key of Object.keys(tmp_material_concrete)) {
          if (key in new_material_concrete) {
            tmp_material_concrete[key] = new_material_concrete[key];
          }
        }
      }

      const new_pile_factor = safety.pile_factor.find(v => v.g_id === groupe.g_id);
      if (new_pile_factor !== undefined) {
        for (let i = 0; i < tmp_pile_factor.length; i++) {
          const tmp = tmp_pile_factor[i];
          const org = new_pile_factor[i];
          for (const key of Object.keys(tmp)) {
            if (key in org) { tmp[key] = org[key]; }
          }
        }
      }
      this.safety_factor[groupe.g_id] = tmp_safety_factor;
      this.material_bar[groupe.g_id] = tmp_material_bar;
      this.material_steel[groupe.g_id] = tmp_material_steel;
      this.material_concrete[groupe.g_id] = tmp_material_concrete;
      this.pile_factor[groupe.g_id] = tmp_pile_factor;
    }

  }

  // ファイルに書き込む用
  public getSaveData(): any {
    return {
      safety_factor: this.safety_factor,
      material_bar: this.material_bar,
      material_steel: this.material_steel,
      material_concrete: this.material_concrete,
      pile_factor: this.pile_factor
    }
  }


}
