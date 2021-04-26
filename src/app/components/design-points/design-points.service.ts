import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputMembersService } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class InputDesignPointsService {

  // 着目点情報
  private position_list: any[];
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

  public getDesignPointColumn(id: number): any {
    let result = this.position_list.find((value)=> value.index === id);

    if(result === undefined){
      result = this.default_position(id);
      this.position_list.push(result);
    }

    return result;
  }

  public getSaveData(): any[] {
    return this.position_list;
  }

  public setSaveData(points: any): void{
    this.clear();
    for(const data of points){
      const tmp = this.default_position(data.id);
      for(const key of Object.keys(tmp)){
        if(key in data){
          tmp[key] = data[key];
        }
      }
      this.position_list.push(tmp);
    }
  }

  public getTableDatas(): any[] {

    const table_datas: any[] = new Array();

    // グリッド用データの作成
    let index = 1;
    for( const groupe of this.getGroupeList()){
      for ( const member of groupe) {
        const position = member.positions;
        if (position.length <= 0) {
          // position が 0行 だったら 空のデータを1行追加する
          const column = this.default_position(index); 
          column.m_no = member.m_no;
          position.push(column);
          index++;
        } else {
          // index を振りなおす
          for (const position of member.positions){
            position.index = index;
            index++;
          }
        }
      }
      table_datas.push(groupe)
    }

    return table_datas;
  }

  // グループ別 部材情報
  //  [{m_no, m_len, g_no, g_id, g_name, shape, B, H, Bt, t, 
  //   positions:[
  //    { index, m_no, p_name, position, p_name_ex, isMyCalc, isVyCalc, isMzCalc, isVzCalc, La },
  //    ...
  //   }, ...
  public getGroupeList(): any[] {

    const groupe_list: any[] = this.members.getGroupeList();
    const position_list = this.position_list;

    for(const groupe of groupe_list) {

      for ( const member of groupe) {
        member['positions'] = new Array();

        // 同じ要素番号のものを探す
        const position: any[] = position_list.filter( 
          item => item.m_no === member.m_no );

        // 対象データが無かった時に処理
        if (position.length > 0) {
          member.positions.push(position);
        }
      }

    }

    return groupe_list;
  }


  // 着目点情報
  public default_position(id: number): any {
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

  // pick up ファイルをセットする関数
  public setPickUpData(pickup_data: Object) {

    const pickup_points: any[] = pickup_data[Object.keys(pickup_data)[0]];

    // 初期化する
    const old_position_list = this.position_list.slice(0, this.position_list.length);
    this.position_list = new Array();

    // 着目点リストを作成する
    for(const pickup_point of pickup_points){
      // 部材番号 をセットする
      let new_member = old_position_list.find((t) => t.index === pickup_point.index);
      if (new_member === undefined) {
        new_member = this.default_position(pickup_point.index);
      }
      // ピックアップファイルから情報を取得する
      new_member.m_no = pickup_point.memberNo;
      new_member.p_name = pickup_point.p_name;
      new_member.position = pickup_point.position;

      // 登録する
      this.position_list.push(new_member);
    }
  }

  // 算出点に何か入力されたタイミング
  // 1行でも計算する断面が存在したら true
  public designPointChange(): boolean{
    for(const columns of this.position_list){
      if ( this.isEnable(columns)){
        return true;
      }
    }
    return false;
  }

  public isEnable(data: any): boolean {
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
    return false;
  }

}
