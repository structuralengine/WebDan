import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputMembersService } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class InputDesignPointsService {

  // 着目点情報
  public position_list: any[];
  // { index, m_no, p_name, position, p_name_ex, isMyCalc, isVyCalc, isMzCalc, isVzCalc, La },

  constructor(
    private members: InputMembersService,
    private helper: DataHelperModule) {
    this.clear();
  }

  public clear(): void {
    // 部材, 着目点 入力画面に関する初期化
    this.position_list = new Array();
  }

  // 着目点情報
  private default_position(id: number): any {
    return {
      index: id,
      m_no: null,
      p_name: null,
      position: null,
      p_name_ex: null,
      isMyCalc: null,
      isVyCalc: null,
      isMzCalc: null,
      isVzCalc: null,
      La: null
    };
  }

  /// <summary>
  /// pick up ファイルをセットする関数
  /// </summary>
  /// <param name="row">行番号</param>
  public setPickUpData(pickup_data: Object) {

    const mList: any[] = pickup_data[Object.keys(pickup_data)[0]];

    // 着目点リストを作成する
    const old_member_list = this.position_list.slice(0, this.position_list.length);
    this.position_list = new Array();
    for (let i = 0; i < mList.length; i++) {
      // 部材番号 をセットする
      let new_member = old_member_list.find((t) => t.m_no === mList[i].memberNo);
      if (new_member === undefined) {
        new_member = this.default_positions(mList[i].memberNo);
      }
      // positions を代入
      const old_position_list = new_member['positions'];
      new_member['positions'] = new Array();
      for (const target of mList[i].positions) {
        let new_position = old_position_list.find((t)=>t.index === target.index);
        if (new_position === undefined) {
          new_position = this.default_position(target.index, target.p_name, target.position);
        }
        new_member['positions'].push(new_position);
      }
      this.position_list.push(new_member);
    }
  }

  /// g_id でグループ化した配列のデータを返す関数
  public getDesignPointColumns(): any[] {

    const position_groupe = new Array();

    // グループ番号を持つ部材のリストを返す
    const groupe_list = this.members.getGroupeList();

    for (const members of groupe_list) {
      const positions = new Array();
      for (const m of members) {
        let p = this.position_list.find((t) => t.m_no === m.m_no);
        if (p === undefined) {
          p = this.default_positions(m.m_no, [this.default_position(m.m_no)]);
          p.positions[0].isMyCalc = true;
          p.positions[0].isVyCalc = true;
          this.position_list.push(p);
        }
        p['g_id'] = m.g_id;
        p['g_name'] = m.g_name;
        p['shape'] = m.shape;
        p['B'] = m.B;
        p['H'] = m.H;
        p['n'] = m.n;
        p['m_len'] = m.m_len;
        positions.push(p);
      }
      position_groupe.push(positions);
    }
    return position_groupe;
  }

  // 算出点に何か入力されたタイミング
  // 1行でも有効なデータ存在したら true
  public designPointChange(): boolean{
    if(this.position_list.length === 0){
      this.getDesignPointColumns();
    }
    for(const member of this.position_list){
      for(const data of member.positions){
        if(data.isMyCalc === true){
          return true;
        }
        if(data.isVyCalc === true){
          return true;
        }
        if(data.isMzCalc === true){
          return true;
        }
        if(data.isVzCalc === true){
          return true;
        }
      }
    }
    return false;
  }

}
