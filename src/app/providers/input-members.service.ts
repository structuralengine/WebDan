import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';

@Injectable({
  providedIn: 'root'
})
export class InputMembersService extends InputDataService {

  // 部材情報
  public member_list: any[];

  constructor() {
    super();
    this.clear();
  }
  public clear(): void {
    this.member_list = new Array();
    // デフォルトで、数行のデータを用意しておく
    for (let i = 1; i <= this.DEFAULT_MEMBER_COUNT; i++) {
      const new_member = this.default_member(i);
      new_member.g_no = 1;
      this.member_list.push(new_member);
    }
  }

  // 部材情報
  private default_member(id: number): any {
    return {
      'm_no': id, 'm_len': null, 'g_no': null, 'g_name': null, 'shape': '',
      'B': null, 'H': null, 'Bt': null, 't': null,
      'con_u': null, 'con_l': null, 'con_s': null,
      'vis_u': false, 'vis_l': false, 'ecsd': null, 'kr': null,
      'r1_1': null, 'r1_2': null, 'r1_3': null, 'n': null
    };
  }

  /// <summary>
  /// pick up ファイルをセットする関数
  /// </summary>
  /// <param name="row">行番号</param>
  public setPickUpData(pickup_data: Object) {

    const mList: any[] = pickup_data[Object.keys(pickup_data)[0]];

    // 部材リストを作成する
    const old_member_list = this.member_list.slice(0, this.member_list.length);
    this.member_list = new Array();

    // 部材番号、部材長 をセットする
    for (let i = 0; i < mList.length; i++) {
      let new_member = old_member_list.find(function (value) {
        return value.m_no === mList[i].memberNo;
      });
      if (new_member === undefined) {
        new_member = this.default_member(mList[i].memberNo);
      }
      // 部材長をセットする
      const pList: any[] = mList[i].positions;
      new_member.m_len = pList[pList.length - 1].position;
      new_member.g_no = null;
      this.member_list.push(new_member);
    }
  }

  /// <summary>
  /// basic-information.component の
  /// pickup_moment_datarows のデータを返す関数
  /// </summary>
  /// <param name="row">行番号</param>
  public getMemberTableColumns(row: number): any {

    const r = this.member_list.filter(function (item, index) {
      if (item.m_no === row) { return item; }
    });

    if (r === undefined) { return null; }

    let result: any = r[0];

    // 対象データが無かった時に処理
    if (result == null) {
      result = this.default_member(row);
      this.member_list.push(result);
    }
    return result;
  }


  // 存在するグループ番号を列挙する
  public getGroupeList(): any[] {

    const groupe_no_list: number[] = new Array();
    for (const m of this.member_list) {
      if (this.toNumber(m['g_no']) === null) {
        m['g_no'] = null;
        continue;
      }
      const g: number = m['g_no'];
      if (groupe_no_list.find(function (value) {
        return value === g;
      }) === undefined) {
        groupe_no_list.push(g);
      }
    }
    groupe_no_list.sort(function (a, b) {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });

    // グループ番号を持つ部材のリストを返す
    const result: any[] = new Array();
    for (const no of groupe_no_list) {
      // グループ番号を持つ部材のリスト
      const members: any[] = this.member_list.filter(function (item, index) {
        if (item.g_no === no) { return item; }
      });
      result.push(members);
    }
    return result;
  }

}