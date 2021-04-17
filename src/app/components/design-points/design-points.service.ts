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

  public getDesignPointColumns(id: number): any {
    let result = this.position_list.find((value)=> value.index === id);

    if(result === undefined){
      result = this.default_position(id);
      this.position_list.push(result);
    }

    return result;
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
