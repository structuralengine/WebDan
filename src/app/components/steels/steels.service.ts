import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputBarsService } from '../bars/bars.service';
import { InputDesignPointsService } from '../design-points/design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputSteelsService {

  // 鉄筋情報
  private steel_list: any[];

  constructor(
    private points: InputDesignPointsService,
    private bars: InputBarsService,
    private helper: DataHelperModule) {
    this.clear();
  }
  public clear(): void {
    this.steel_list = new Array();
  }

  // 鉄筋情報
  private default_steels(id: number): any {
    return {
      m_no: null,
      shape: null,
      index: id,
      position: null,
      p_name: null,
      p_name_ex: null,
      b: null,
      h: null,
      I: this.default_I_steel(),
      H: this.default_H_steel(),
    };
  }

  private default_I_steel(): any {
    return {
      title: 'I',
      upper_cover: null,
      upper_width: null,
      upper_thickness: null,
      web_thickness: null,
      web_height: null,
      lower_width: null,
      lower_thickness: null
    };
  }

  private default_H_steel(): any {
    return {
      title: 'H',
      left_cover: null,
      left_width: null,
      left_thickness: null,
      web_thickness: null,
      web_height: null,
      right_width: null,
      right_thickness: null
    };
  }


  public getTableColumns(): any[] {

    const table_datas: any[] = new Array();

    const groupe_list = this.points.getGroupeList();
    for (let i = 0; i < groupe_list.length; i++) {
      const table_groupe = [];
      // 部材
      for (const member of groupe_list[i]) {
        // 着目点
        for (let k = 0; k < member.positions.length; k++) {
          const pos = member.positions[k];
          if (!this.points.isEnable(pos)) {
            continue;
          }
          const data: any = this.getTableColumn(pos.index);
          const bar: any = this.bars.getTableColumn(pos.index);
          data.m_no = member.m_no;
          data.b = member.B;
          data.h = member.H;
          data.shape = member.shape;
          data.position = pos.position;
          data.p_name = pos.p_name;
          data.p_name_ex = pos.p_name_ex;

          // データを2行に分ける
          const column1 = {};
          const column2 = {};
          column1['m_no'] = (k === 0) ? member.m_no: ''; // 最初の行には 部材番号を表示する

          // 1行目
          column1['index'] = data['index'];
          const a: number = this.helper.toNumber(data.position);
          column1['position'] = (a === null) ? '' : a.toFixed(3);
          column1['p_name'] = data['p_name'];
          column1['p_name_ex'] = data['p_name_ex'];
          column1['bh'] = data['b'];

          column1['design_point_id'] = data['I'].title;

          column1['upper_left_cover'] = data['I'].upper_cover;

          column1['upper_left_width'] = data['I'].upper_width;
          column1['upper_left_thickness'] = data['I'].upper_thickness;

          column1['web_thickness'] = data['I'].web_thickness;
          column1['web_height'] = data['I'].web_height;

          column1['lower_right_width'] = data['I'].lower_width;
          column1['lower_right_thickness'] = data['I'].lower_thickness;
          column1['enable'] = bar['rebar1'].enable;

          table_groupe.push(column1);

          // 2行目
          column2['bh'] = data['h'];

          column2['design_point_id'] = data['H'].title;

          column2['upper_left_cover'] = data['H'].left_cover;

          column2['upper_left_width'] = data['H'].left_width;
          column2['upper_left_thickness'] = data['H'].left_thickness;

          column2['web_thickness'] = data['H'].web_thickness;
          column2['web_height'] = data['H'].web_height;

          column2['lower_right_width'] = data['H'].right_width;
          column2['lower_right_thickness'] = data['H'].right_thickness;
          column2['enable'] = bar['rebar2'].enable;

          table_groupe.push(column2);
        }
      }
      table_datas.push(table_groupe);
    }
    return table_datas;
  }

  private getTableColumn(index: any): any {

    let result = this.steel_list.find((value) => value.index === index);
    if (result === undefined) {
      result = this.default_steels(index);
      this.steel_list.push(result);
    }
    return result;
  }

  public setSaveData(table_datas: any[]) {

    this.steel_list = new Array();

    for ( let i = 0; i < table_datas.length; i += 2 ) {
      const column1 = table_datas[i];
      const column2 = table_datas[i + 1];

      const b = this.default_steels(column1.index);
      b.m_no = column1.m_no;
      b.p_name = column1.p_name;
      b.position = column1.position;
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

  public setPickUpData() {

  }

  public getSaveData(): any[] {
    return this.steel_list;
  }

  public getGroupeName(i: number): string {
    return this.points.getGroupeName(i);
  }
  
}
