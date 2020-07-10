import { Injectable } from '@angular/core';
import { InputDataService } from '../../providers/input-data.service';
import { InputDesignPointsService } from '../design-points/input-design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputSteelsService {

  // 鉄筋情報
  public steel_list: any[];

  constructor(private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.steel_list = new Array();
  }
   
  /// <summary>
  /// bars の
  /// g_id でグループ化した配列のデータを返す関数
  /// </summary>
  public getSteelColumns(): any[] {

    const result: any[] = new Array();

    const old_steel_list = this.steel_list.slice(0, this.steel_list.length);
    // this.steel_list = new Array();

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
          let b = old_steel_list.find( (value) => {
            return (value.m_no === members.m_no && value.p_name === position.p_name);
          });
          if (b === undefined) {
            b = this.default_steels(members.m_no, position.p_name, position.position);
          }
          b.index = position['index'];
          b.shape = members["shape"];
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
  /// bars の データを 保存する関数
  /// </summary>
  public setSteelsColumns(table_datas: any[][]): void {

    this.steel_list = new Array();

    for (const groupe of table_datas) {
      for ( let i = 0; i < groupe.length; i += 2 ) {
        const column1 = groupe[i];
        const column2 = groupe[i + 1];

        const b = this.default_steels(column1.m_no, column1.p_name, column1.position);
        b['index'] = column1.index;
        b.p_name_ex = column1.p_name_ex;
        b.b = column1.bh;
        b.h = column2.bh;

        b['I'].title = column1.design_point_id;
        b['I'].upper_cover =  column1.upper_left_cover;
        b['I'].upper_width =  column1.upper_left_width;
        b['I'].upper_thickness =  column1.upper_left_thickness;
        b['I'].web_thickness =  column1.web_thickness;
        b['I'].web_height =  column1.web_height;
        b['I'].lower_width =  column1.lower_right_width;
        b['I'].lower_thickness =  column1.lower_right_thickness;

        b['H'].title = column2.design_point_id;
        b['H'].left_cover =  column2.upper_left_cover;
        b['H'].left_width =  column2.upper_left_width;
        b['H'].left_thickness =  column2.upper_left_thickness;
        b['H'].web_thickness =  column2.web_thickness;
        b['H'].web_height =  column2.web_height;
        b['H'].right_width =  column2.lower_right_width;
        b['H'].right_thickness =  column2.lower_right_thickness;

        this.steel_list.push(b);
      }
    }
  }

  // 鉄筋情報
  private default_steels(id: number, p_name: string, position: number): any {
    return {
      'm_no': id,
      'shape': null,
      'index': null,
      'position': position,
      'p_name': p_name,
      'p_name_ex': null,
      'b': null,
      'h': null,
      'I': this.default_I_steel(),
      'H': this.default_H_steel(),
    };
  }

  private default_I_steel(): any {
    return {
      'title': 'I',
      'upper_cover': null,
      'upper_width': null,
      'upper_thickness': null,
      'web_thickness': null,
      'web_height': null,
      'lower_width': null,
      'lower_thickness': null
    };
  }

  private default_H_steel(): any {
    return {
      'title': 'H',
      'left_cover': null,
      'left_width': null,
      'left_thickness': null,
      'web_thickness': null,
      'web_height': null,
      'right_width': null,
      'right_thickness': null
    };
  }

}
