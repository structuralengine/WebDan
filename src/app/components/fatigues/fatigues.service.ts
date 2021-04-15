import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputDesignPointsService } from '../design-points/design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputFatiguesService  {

  // 疲労情報
  public fatigue_list: any[];
  public train_A_count: number; // A列車本数
  public train_B_count: number; // B列車本数
  public service_life: number;  // 耐用年数
  public reference_count: number; // 200万回

  constructor(private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    // 疲労強度入力画面に関する初期化
    this.fatigue_list = new Array();
    this.train_A_count = null;
    this.train_B_count = null
    this.service_life = null;
    this.reference_count = 2000000;
  }

  /// <summary>
  /// fatigues の
  /// g_id でグループ化した配列のデータを返す関数
  /// </summary>
  public getFatiguesColumns(): any[] {

    const result: any[] = new Array();

    const old_fatigue_list = this.fatigue_list.slice(0, this.fatigue_list.length);
    // this.fatigue_list = new Array();

    const design_points: any[] = this.points.getDesignPointColumns();

    for (const groupe of design_points) {
      const member_list = new Array();
      for (const members of groupe) {
        const position_list = { g_name: members.g_name, g_id: members.g_id, positions: new Array() };
        for (const position of members['positions']) {
          if (position['isMyCalc'] !== true && position['isVyCalc'] !== true
              && position['isMzCalc'] !== true && position['isVzCalc'] !== true) {
            continue;
          }
          let b = old_fatigue_list.find( (value) => {
            return (value.m_no === members.m_no && value.p_name === position.p_name);
          });
          if (b === undefined) {
            b = this.default_fatigue(members.m_no, position.p_name);
          }
          b.index = position['index'];
          b.position = position['position'];
          b.p_name_ex = position['p_name_ex'];
          b.b = members['B'];
          b.h = members['H'];
          position_list['positions'].push(b);
        }
        member_list.push(position_list);
      }
      result.push(member_list);
    }
    return result;
  }

  /// <summary>
  /// fatigues の データを 保存する関数
  /// </summary>
  public setFatiguesColumns(table_datas: any[][]): void {

    this.fatigue_list = new Array();

    for (const groupe of table_datas) {
      for ( let i = 0; i < groupe.length; i += 2 ) {
        const column1 = groupe[i];
        const column2 = groupe[i + 1];

        const f = this.default_fatigue(column1.m_no, column1.p_name);
        f['index'] = column1.index;
        f.p_name_ex = column1.p_name_ex;
        f.b = column1.bh;
        f.h = column2.bh;

        f.title1 = column1.design_point_id;
        f['M1'].SA = column1.M_SA;
        f['M1'].SB =  column1.M_SB;
        f['M1'].NA06 =  column1.M_NA06;
        f['M1'].NB06 =  column1.M_NB06;
        f['M1'].NA12 =  column1.M_NA12;
        f['M1'].NB12 =  column1.M_NB12;
        f['M1'].A =  column1.M_A;
        f['M1'].B =  column1.M_B;

        f['V1'].SA = column1.V_SA;
        f['V1'].SB =  column1.V_SB;
        f['V1'].NA06 =  column1.V_NA06;
        f['V1'].NB06 =  column1.V_NB06;
        f['V1'].NA12 =  column1.V_NA12;
        f['V1'].NB12 =  column1.V_NB12;
        f['V1'].A =  column1.V_A;
        f['V1'].B =  column1.V_B;

        f.title2 = column2.design_point_id;
        f['M2'].SA = column2.M_SA;
        f['M2'].SB =  column2.M_SB;
        f['M2'].NA06 =  column2.M_NA06;
        f['M2'].NB06 =  column2.M_NB06;
        f['M2'].NA12 =  column2.M_NA12;
        f['M2'].NB12 =  column2.M_NB12;
        f['M2'].A =  column2.M_A;
        f['M2'].B =  column2.M_B;

        f['V2'].SA = column2.V_SA;
        f['V2'].SB =  column2.V_SB;
        f['V2'].NA06 =  column2.V_NA06;
        f['V2'].NB06 =  column2.V_NB06;
        f['V2'].NA12 =  column2.V_NA12;
        f['V2'].NB12 =  column2.V_NB12;
        f['V2'].A =  column2.V_A;
        f['V2'].B =  column2.V_B;

        this.fatigue_list.push(f);
      }
    }
  }

  // 疲労情報
  private default_fatigue(m_no: number,  p_name: string): any {
    return {
      'm_no': m_no,
      'index': null,
      'p_name': p_name,
      'p_name_ex': null,
      'b': null,
      'h': null,
      'title1': '上',
      'M1': this.default_fatigue_coefficient(),
      'V1': this.default_fatigue_coefficient(),
      'title2': '下',
      'M2': this.default_fatigue_coefficient(),
      'V2': this.default_fatigue_coefficient()
    };
  }

  private default_fatigue_coefficient(): any {
    return {
      'SA': null,
      'SB': null,
      'NA06': null,
      'NB06': null,
      'NA12': null,
      'NB12': null,
      'A': null,
      'B': null
    };
  }

}
