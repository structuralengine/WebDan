import { Injectable } from '@angular/core';
import { InputDataService } from '../../providers/input-data.service';
import { InputBasicInformationService } from '../basic-information/input-basic-information.service';
import { InputMembersService } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class InputSafetyFactorsMaterialStrengthsService  {

  // 安全係数情報
  public safety_factor_material_strengths_list: any[];

  private safety_factor_title: string[]
  public pile_factor_list: any[];

  constructor(
    private basic: InputBasicInformationService,
    private members: InputMembersService,
    private helper: InputDataService) {
    this.clear();
  }
  public clear(): void {
    this.safety_factor_material_strengths_list = new Array();
    this.initSpecificationTitles();
  }

  public getGroupeList(): any[] {
    return this.members.getGroupeList();
  }

  public getTableColumns(g_id: string): any {

    let result = this.safety_factor_material_strengths_list.find( (value) => {
      return value.g_id.toString() === g_id;
    });
    if (result === undefined) {
      result = this.default_safety_factor_material_strengths(g_id);
      this.safety_factor_material_strengths_list.push(result);
    }
    if (('safety_factor' in result) === false) {
      result['safety_factor'] = this.default_safety_factor();
    }
    if (('material_bar' in result) === false) {
      result['material_bar'] = this.default_material_bar();
    }
    if (('material_steel' in result) === false) {
      result['material_steel'] = this.default_material_steel();
    }
    if (('material_concrete' in result) === false) {
      result['material_concrete'] = this.default_material_concrete();
    }
    if (('pile_factor_selected' in result) === false) {
      result['pile_factor_selected'] = this.pile_factor_list[0].id;
    }
    result['safety_factor_title'] = this.safety_factor_title;
    result['pile_factor_list'] = this.pile_factor_list;
    return result;
  }

  public setTableColumns(data: any): void {

    this.safety_factor_material_strengths_list = new Array();

    for (const current_data of data) {

      const target = { 'g_id': current_data.g_id};

      // 安全係数を保存用変数に格納する
      target['safety_factor'] = new Array();
      for (const current_safety_factor of current_data['safety_factor']) {
        let temp = {};
        for( const key of Object.keys(current_safety_factor)){
          temp[key] = this.helper.toNumber(current_safety_factor[key]);
        }
        target['safety_factor'].push(temp)
      }

      // 鉄筋強度を保存用変数に格納する
      target['material_bar'] = new Array();
      for (const current_bar of current_data['material_bar']) {
        let temp = {};
        for( const key of Object.keys(current_bar)){
          temp[key] = this.helper.toNumber(current_bar[key]);
        }
        target['material_bar'].push(temp);
      }
      
      // 鉄骨強度を保存用変数に格納する
      target['material_steel'] = new Array();
      for (const current_steel of current_data['material_steel']) {
        let temp = {};
        for (const key of Object.keys(current_steel)) {
          temp[key] = this.helper.toNumber(current_steel[key]);
        }
        target['material_steel'].push(temp);
      }

      // コンクリート強度を保存用変数に格納する
      target['material_concrete'] = this.default_material_concrete();
      const current_concrete = current_data['material_concrete'];
      target['material_concrete'].fck = this.helper.toNumber(current_concrete[0].value);
      target['material_concrete'].dmax = this.helper.toNumber(current_concrete[1].value);

      // 杭の施工条件を保存用変数に格納する
      const current_pile_factor_selected = current_data['pile_factor_selected'];
      target['pile_factor_selected'] = current_pile_factor_selected;

      // 保存用変数に格納する
      this.safety_factor_material_strengths_list.push(target);
    }
  }


  private default_safety_factor_material_strengths(g_id: string): any {

    const result = {
      'g_id': g_id,
      'safety_factor': this.default_safety_factor(),
      'material_bar': this.default_material_bar(),
      'material_steel': this.default_material_steel(),
      'material_concrete': this.default_material_concrete(),
      'pile_factor_selected': this.pile_factor_list[0].id
    }
    return result;
  }

  // 材料強度情報
  public default_safety_factor(): any[] {
    return [
      {
        'M_rc': 1.00,
        'M_rs': 1.00,
        'M_rbs': 1.00,
        'V_rc': 1.00,
        'V_rs': 1.00,
        'V_rbc': 1.00,
        'V_rbs': 1.00,
        'V_rbv': null,
        'ri': 1.00,
        'range': 1,
        'S_rs': 1.0,
        'S_rb': 1.0
      },
      {
        'M_rc': 1.30,
        'M_rs': 1.05,
        'M_rbs': 1.10,
        'V_rc': 1.30,
        'V_rs': 1.05,
        'V_rbc': 1.30,
        'V_rbs': 1.10,
        'V_rbv': null,
        'ri': 1.10,
        'range': 2,
        'S_rs': 1.0,
        'S_rb': 1.1
      },
      {
        'M_rc': 1.30,
        'M_rs': 1.00,
        'M_rbs': 1.10,
        'V_rc': 1.30,
        'V_rs': 1.00,
        'V_rbc': 1.30,
        'V_rbs': 1.10,
        'V_rbv': 1.20,
        'ri': 1.20,
        'range': 3,
        'S_rs': 1.05,
        'S_rb': 1.1
      },
      {
        'M_rc': 1.30,
        'M_rs': 1.00,
        'M_rbs': 1.00,
        'V_rc': 1.30,
        'V_rs': 1.00,
        'V_rbc': 1.30,
        'V_rbs': 1.00,
        'V_rbv': 1.20,
        'ri': 1.20,
        'range': 3,
        'S_rs': 1.05,
        'S_rb': 1.1
      },
      {
        'M_rc': 1.30,
        'M_rs': 1.00,
        'M_rbs': 1.00,
        'V_rc': 1.30,
        'V_rs': 1.00,
        'V_rbc': 1.30,
        'V_rbs': 1.00,
        'V_rbv': 1.20,
        'ri': 1.00,
        'range': 3,
        'S_rs': 1.05,
        'S_rb': 1.1
      }
    ]
  }

  // 材料強度情報
  public default_material_bar(): any[] {
    return [
      {fsy1:29,  fsu1:29},
      {fsy1:345, fsy2:390, fsu1:490, fsu2:560},
      {fsy1:345, fsy2:390, fsu1:490, fsu2:560},
      {fsy1:345, fsy2:390, fsu1:490, fsu2:560}
    ]
  }

  // 材料強度情報
  public default_material_steel(): any[] {
    return [
      { SRCfsyk1: 16, SRCfsyk2: 40, SRCfsyk3: 75 },
      { SRCfsyk1: 245, SRCfsyk2: 235, SRCfsyk3: 215 },
      { SRCfsyk1: 140, SRCfsyk2: 135, SRCfsyk3: 125 },
      { SRCfsyk1: 400, SRCfsyk2: 400, SRCfsyk3: 400 }
    ]
  }

  public default_material_concrete(): any {
    return {
      'fck': 24,
      'dmax': 25
    };
  }

  /// <summary>
  /// specification1_selected によって変わる項目の設定
  /// </summary>
  public initSpecificationTitles(): void {

    switch (this.basic.specification1_selected) {
      case 0: // 鉄道
        this.safety_factor_title = [
          '耐久性, 使用性',
          '安全性 （疲労破壊）',
          '安全性 （破壊）',
          '復旧性 （損傷）地震時以外',
          '復旧性 （損傷）地震時'
        ]

        this.pile_factor_list = [
          { id: 'pile-000', title: '使用しない', rfck: 1.0, rfbok: 1.0, rEc: 1.0, rVcd: 1.0 },
          { id: 'pile-001', title: '泥水比重1.04以下', rfck: 0.8, rfbok: 0.7, rEc: 0.8, rVcd: 0.9 },
          { id: 'pile-002', title: '自然泥水, 泥水比重1.10以下', rfck: 0.7, rfbok: 0.6, rEc: 0.8, rVcd: 0.9 },
          { id: 'pile-003', title: 'ベントナイト泥水', rfck: 0.6, rfbok: 0.5, rEc: 0.7, rVcd: 0.8 },
          { id: 'pile-004', title: '気中施工', rfck: 0.9, rfbok: 0.9, rEc: 0.9, rVcd: 1.0 },
        ];

        break;

      case 1: // 道路
        this.safety_factor_title = new Array();
        this.pile_factor_list = new Array();

        break;
      default:
        return;
    }

  }

}
