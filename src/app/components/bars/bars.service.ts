import { Injectable } from '@angular/core';
import { InputDataService } from '../../providers/input-data.service';
import { InputDesignPointsService } from '../design-points/design-points.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputBarsService {

  // 鉄筋情報
  public bar_list: any[];

  constructor(private helper: InputDataService,
              private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.bar_list = new Array();
  }
   
  /// <summary>
  /// bars の
  /// g_id でグループ化した配列のデータを返す関数
  /// </summary>
  public getBarsColumns(isAll: boolean = false): any[] {

    const result: any[] = new Array();

    const old_bar_list = this.bar_list.slice(0, this.bar_list.length);
    // this.bar_list = new Array();

    const design_points: any[] = this.points.getDesignPointColumns();

    for (const groupe of design_points) {
      const member_list = new Array();
      for (const members of groupe) {
        const position_list = { g_name: members.g_name, g_id: members.g_id, positions: new Array() };
        for (const position of members['positions']) {

          if ( isAll === false ) {
            // 計算対象ではない、カラムは省略する
            if (position['isMyCalc'] !== true && position['isVyCalc'] !== true
              && position['isMzCalc'] !== true && position['isVzCalc'] !== true) {
              continue;
            }
          }

          let b = old_bar_list.find( (value) => {
            return (value.m_no === members.m_no && value.p_name === position.p_name);
          });
          if (b === undefined) {
            b = this.default_bars(members.m_no, position.p_name, position.position);
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

  public getAllColumnsBar(): any[] {

    const result: any[] = new Array();

    const old_bar_list = this.bar_list.slice(0, this.bar_list.length);
    // this.bar_list = new Array();

    const design_points: any[] = this.points.getDesignPointColumns();

    for (const groupe of design_points) {
      const member_list = new Array();
      for (const members of groupe) {
        const position_list = { g_name: members.g_name, g_id: members.g_id, positions: new Array() };
        for (const position of members['positions']) {
          let b = old_bar_list.find( (value) => {
            return (value.m_no === members.m_no && value.p_name === position.p_name);
          });
          if (b === undefined) {
            b = this.default_bars(members.m_no, position.p_name, position.position);
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
  /// bars の データを 保存する関数
  /// </summary>
  public setBarsColumns(table_datas: any[][]): void {

    this.bar_list = new Array();

    let temp: number = 0;

    for (const groupe of table_datas) {
      for ( let i = 0; i < groupe.length; i += 2 ) {
        const column1 = groupe[i];
        const column2 = groupe[i + 1];

        if( 'm_no' in column1) {
          temp = column1.m_no;
        } else {
          column1.m_no = temp;
        }

        const b = this.default_bars(temp, column1.p_name, column1.position);
        b['index'] = column1.index;
        b.p_name_ex = column1.p_name_ex;
        b.b = column1.bh;
        b.h = column2.bh;
        b.haunch_M = column1.haunch_height;
        b.haunch_V = column2.haunch_height;

        b['rebar1'].title = column1.design_point_id;
        b['rebar1'].rebar_dia =  column1.rebar_dia;
        b['rebar1'].rebar_n =  column1.rebar_n;
        b['rebar1'].rebar_cover =  column1.rebar_cover;
        b['rebar1'].rebar_lines =  column1.rebar_lines;
        b['rebar1'].rebar_space =  column1.rebar_space;
        b['rebar1'].rebar_ss =  column1.rebar_ss;
        b['rebar1'].cos =  column1.cos;
        b['rebar1'].enable =  column1.enable;

        b['rebar2'].title = column2.design_point_id;
        b['rebar2'].rebar_dia =  column2.rebar_dia;
        b['rebar2'].rebar_n =  column2.rebar_n;
        b['rebar2'].rebar_cover =  column2.rebar_cover;
        b['rebar2'].rebar_lines =  column2.rebar_lines;
        b['rebar2'].rebar_space =  column2.rebar_space;
        b['rebar2'].rebar_ss =  column2.rebar_ss;
        b['rebar2'].cos =  column2.cos;
        b['rebar2'].enable =  column2.enable;

        b['sidebar'].side_dia =  column1.side_dia;
        b['sidebar'].side_n =  column1.side_n;
        b['sidebar'].side_cover =  column1.side_cover;
        b['sidebar'].side_ss =  column1.side_ss;

        b['starrup'].stirrup_dia =  column1.stirrup_dia;
        b['starrup'].stirrup_n =  column1.stirrup_n;
        b['starrup'].stirrup_ss =  column1.stirrup_ss;

        b['bend'].bending_dia =  column2.stirrup_dia;
        b['bend'].bending_n =  column2.stirrup_n;
        b['bend'].bending_ss =  column2.stirrup_ss;
        b['bend'].bending_angle =  45;

        b.tan   = column1.tan;

        this.bar_list.push(b);
      }
    }
  }

  // 鉄筋情報
  private default_bars(id: number, p_name: string, position: number): any {
    return {
      'm_no': id,
      'index': null,
      'position': position,
      'p_name': p_name,
      'p_name_ex': null,
      'b': null,
      'h': null,
      'haunch_M': null,
      'haunch_V': null,
      'rebar1': this.default_rebar('上'),
      'rebar2': this.default_rebar('下'),
      'sidebar': this.default_sidebar(),
      'starrup': this.default_starrup(),
      'bend': this.default_bend(),
      'tan': null
    };
  }

  private default_rebar(title: string): any {
    return {
      'title': title,
      'rebar_dia': null,
      'rebar_n': null,
      'rebar_cover': null,
      'rebar_lines': null,
      'rebar_space': null,
      'rebar_ss': null,
      'cos': null,
      'enable': null
    };
  }

  private default_sidebar(): any {
    return {
      'side_dia': null,
      'side_n': null,
      'side_cover': null,
      'side_ss': null
    };
  }

  private default_starrup(): any {
    return {
      'stirrup_dia': null,
      'stirrup_n': null,
      'stirrup_ss': null
    };
  }

  private default_bend(): any {
    return {
      'bending_dia': null,
      'bending_n': null,
      'bending_ss': null,
      'bending_angle': null
    };
  }

  public matchBarSize(dia: any): number {

    let result: number = null;
    const temp = this.helper.toNumber(dia);
    for ( const d of this.helper.rebar_List ){
      if ( d.D === temp){
        result = temp;
        break;
      }       
    }
    return result;
  }
}
