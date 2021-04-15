import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class InputMembersService  {

  // 部材情報
  public member_list: any[];

  constructor(private helper: DataHelperModule) {
    this.clear();
  }
  public clear(): void {
    this.member_list = new Array();
  }

  // 部材情報
  private default_member(row: number): any {
    // メモ:
    // g_no: 表面上の(member.component だけで用いる)グループ番号
    // g_id: 本当のグループ番号
    return {
      'm_no': row, 'm_len': null, 'g_no': null, 'g_id': '', 'g_name': '', 'shape': '',
      'B': null, 'H': null, 'Bt': null, 't': null,
    };
  }

  // member_list から 指定行 のデータを返す関数
  public getMemberTableColumns(row: number): any {

    const r = this.member_list.find( (item) => item.m_no === row );

    let result: any;

    // 対象データが無かった時に処理
    if (r !== undefined) {
      result = r;
      if(result.g_no === null){
        result.g_id = '';
      }
    } else {
      result = this.default_member(row);
      this.member_list.push(result);
    }
    return result;
  }


  /// pick up ファイルをセットする関数
  public setPickUpData(pickup_data: Object, isManualed: boolean) {

    const mList: any[] = pickup_data[Object.keys(pickup_data)[0]];

    // 部材リストを作成する
    const old_member_list = this.member_list.slice(0, this.member_list.length);
    this.member_list = new Array();

    // 部材番号、部材長 をセットする
    for (let i = 0; i < mList.length; i++) {
      let new_member = old_member_list.find( (value) => {
        return value.m_no === mList[i].memberNo;
      });
      if (new_member === undefined) {
        new_member = this.default_member(mList[i].memberNo);
      }
      // 部材長をセットする
      const pList: any[] = mList[i].positions;
      new_member.m_len = pList[pList.length - 1].position;
      if (isManualed) {
        new_member.g_id = '';
      }
      this.member_list.push(new_member);
    }
  }


  // 部材に何か入力されたタイミング
  // 1行でも有効なデータ存在したら true
  public checkMemberEnables(): boolean {
    for(const columns of this.member_list){
      if ( this.isEnable(columns)){
        return true;
      }
    }
    return false;
  }

  // 有効なデータ存在したら true
  public isEnable(columns) {
    if(columns.g_name !== null && columns.g_name !== undefined){
      if(columns.g_name.trim().length > 0){
        return true;
      }
    }
    if(columns.shape !== null && columns.shape !== undefined){
      if(columns.shape.trim().length > 0){
        return true;
      }
    }
    if(columns.B !== null && columns.B !== undefined){
      return true;
    }
    if(columns.H !== null && columns.H !== undefined){
      return true;
    }
    if(columns.Bt !== null && columns.Bt !== undefined){
      return true;
    }
    if(columns.t !== null && columns.t !== undefined){
      return true;
    }

    return false;
  }

}
