import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputFatiguesService  {

  // 疲労情報
  private fatigue_list: any[];
  private train_A_count: number; // A列車本数
  private train_B_count: number; // B列車本数
  private service_life: number;  // 耐用年数
  private reference_count: number; // 200万回

  constructor() {
    this.clear();
  }
  public clear(): void {
    // 疲労強度入力画面に関する初期化
    this.fatigue_list = new Array();
    this.train_A_count = null;
    this.train_B_count = null
    this.service_life = null;
    this.reference_count = 2000000;
  }

  public getFatiguesColumns(index: any): any {

    let result = this.fatigue_list.find((value)=> value.index === index);
    if(result === undefined){
      result = this.default_fatigue(index);
      this.fatigue_list.push(result);
    }
    return result;

  }

  // 疲労情報
  private default_fatigue(id: number): any {
    return {
      'm_no': null,
      'index': id,
      'p_name': null,
      'p_name_ex': null,
      'b': null,
      'h': null,
      'title1': '上',
      'M1': this.default_fatigue_coefficient(),
      'V1': this.default_fatigue_coefficient(),
      'title2': '下',
      'M2': this.default_fatigue_coefficient(),
      'V2': this.default_fatigue_coefficient()
    };
  }

  private default_fatigue_coefficient(): any {
    return {
      'SA': null,
      'SB': null,
      'NA06': null,
      'NB06': null,
      'NA12': null,
      'NB12': null,
      'A': null,
      'B': null
    };
  }

}
