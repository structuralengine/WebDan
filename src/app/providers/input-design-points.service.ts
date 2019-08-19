import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import {InputMembersService } from './input-members.service';

@Injectable({
  providedIn: 'root'
})
export class InputDesignPointsService extends InputDataService {

  // 着目点情報
  public position_list: any[];

  constructor(private members: InputMembersService) {
    super();
    this.clear();
  }
  public clear(): void {

    // 部材, 着目点 入力画面に関する初期化
    this.position_list = new Array();

    // デフォルトで、数行のデータを用意しておく
    for (let i = 1; i <= this.DEFAULT_MEMBER_COUNT; i++) {
      const new_point = this.default_positions(i, [this.default_position('', null)]);
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
  private default_position(p_name: string, position: number): any {
    return {
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
          new_position = this.default_position(mList[i].positions[j].p_name, mList[i].positions[j].position);
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
        p['B'] = m.B;
        p['H'] = m.H;
        positions.push(p);
      }
      result.push(positions);
    }
    return result;
  }


}
