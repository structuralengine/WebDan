import { Injectable } from '@angular/core';
import { InputDataService } from '../../providers/input-data.service';
import {InputMembersService } from '../members/input-members.service';

@Injectable({
  providedIn: 'root'
})
export class InputDesignPointsService  {

  // 着目点情報
  public position_list: any[];

  constructor(private members: InputMembersService,
              private helper: InputDataService) {
    this.clear();
  }
  public clear(): void {

    // 部材, 着目点 入力画面に関する初期化
    this.position_list = new Array();

    // デフォルトで、数行のデータを用意しておく
    for (let i = 1; i <= this.helper.DEFAULT_MEMBER_COUNT; i++) {
      const new_point = this.default_positions(i, [this.default_position(i, '', null)]);
      new_point.positions[0].isMyCalc = true;
      new_point.positions[0].isVyCalc = true;
      this.position_list.push(new_point);
    }
  }

  // 着目点情報
  private default_positions(id: number, position: any[]): any {
    return {
      'm_no': id, 'positions': position
    };
  }
  private default_position(index: number, p_name: string, position: number): any {
    return {
      'index': index,
      'p_name': p_name, 'position': position, 'p_name_ex': null,
      'isMyCalc': null, 'isVyCalc': null,
      'isMzCalc': null, 'isVzCalc': null,
      'La': null
    };
  }

  /// <summary>
  /// pick up ファイルをセットする関数
  /// </summary>
  /// <param name="row">行番号</param>
  public setPickUpData(pickup_data: Object) {
    
    const mList: any[] = pickup_data[Object.keys(pickup_data)[0]];

    // 着目点リストを作成する
    const old_position_list = this.position_list.slice(0, this.position_list.length);
    this.position_list = new Array();
    for (let i = 0; i < mList.length; i++) {
      // 部材番号 をセットする
      let new_member = old_position_list.find(function (value) {
        return value.m_no === mList[i].memberNo;
      });
      if (new_member === undefined) {
        new_member = this.default_positions(mList[i].memberNo, new Array);
      }
      // positions を代入
      new_member['positions'] = new Array();
      for (let j = 0; j < mList[i].positions.length; j++) {
        let new_position = old_position_list.find(function (value) {
          for (let k = 0; k < value.positions.Length; k++) {
            return value.positions[k].position === mList[i].positions[j].position;
          }
        });
        if (new_position === undefined) {
          const info = mList[i].positions[j];
          new_position = this.default_position(info.index, info.p_name, info.position);
        }
        new_member['positions'].push(new_position);
      }
      this.position_list.push(new_member);
    }

  }

  /// <summary>
  /// design-point の
  /// g_no でグループ化した配列のデータを返す関数
  /// </summary>
  public getDesignPointColumns(): any[] {

    const result: any[] = new Array();

    // グループ番号を持つ部材のリストを返す
    for (const members of this.members.getGroupeList()) {
      const positions = new Array();
      for (const m of members) {
        const p = this.position_list.find(function (value) {
          return value.m_no === m.m_no;
        });
        if (p === undefined) { continue; }
        p['g_no'] = m.g_no;
        p['g_name'] = m.g_name;
        p['shape'] = m.shape;
        p['B'] = m.B;
        p['H'] = m.H;
        p['n'] = m.n;
        p['m_len'] = m.m_len;
        positions.push(p);
      }
      result.push(positions);
    }
    return result;
  }

  /// <summary>
  /// bars の データを 保存する関数
  /// </summary>
  public setDesignPointColumns(table_datas: any[][]): void {
    // 変更はすでに this.position_list に反映されているっぽいのでコメントアウト
/*
    this.position_list = new Array();

    for (const groupe of table_datas) {
      for ( let i = 0; i < groupe.length; i ++ ) {
        const column1 = groupe[i];

        const b = this.default_bars(column1.m_no, column1.p_name, column1.position);
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

        b['bend'].bending_dia =  column1.bending_dia;
        b['bend'].bending_n =  column1.bending_n;
        b['bend'].bending_ss =  column1.bending_ss;
        b['bend'].bending_angle =  column1.bending_angle;

        b.tan   = column1.haunch_height;

        this.position_list.push(b);
      }
    }
    */
  }

}
