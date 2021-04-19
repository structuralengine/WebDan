import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputBasicInformationService  {

  // pick up table に関する変数
  private pickup_moment: any[] = new Array();
  private pickup_shear_force: any[] = new Array();

  // 適用 に関する変数
  private specification1_list: any[];

  // 仕様 に関する変数
  private specification2_list: any[];

  // 設計条件
  private conditions_list: any[];

  constructor() {
    this.clear();
  }
  public clear(): void {

    this.specification1_list = [
      { id: 0, title: '鉄道', selected: true },
      { id: 1, title: '道路', selected: false }
    ];

    this.initSpecificationTitles();

  }

  /// specification1_selected によって変わる項目の設定
  private initSpecificationTitles(): void {

    const index: number = this.specification1_list.find(
      value=>value.selected === true);

    switch (index) {
      case 0: // 鉄道

        // 曲げモーメントテーブル
        const keys_moment = [ 
          '耐久性 縁応力度検討用',
          '耐久性 （永久荷重）',
          '安全性 （疲労破壊）疲労限',
          '安全性 （疲労破壊）永久作用',
          '安全性 （疲労破壊）永久＋変動',
          '安全性 （破壊）',
          '復旧性 （損傷）地震時以外',
          '復旧性 （損傷）地震時' 
        ];
        // 古い入力を取っておく
        const old_moment: number[] = new Array();
        for(let i=0; i<keys_moment.length;i++){
          if(this.pickup_moment.length>i){
            old_moment.push(this.pickup_moment[i].no);
          }else {
            old_moment.push(null);
          }
        }
        this.pickup_moment = new Array();
        for(let i=0; i<keys_moment.length;i++){
          this.pickup_moment.push({
            title: keys_moment[i], no: old_moment[i]
          });
        }

        // せん断力テーブル
        const keys_shear = [ 
          '耐久性 せん断ひび割れ検討判定用',
          '耐久性 （永久荷重）',
          '耐久性 （変動荷重）',
          '安全性 （疲労破壊）永久作用',
          '安全性 （疲労破壊）永久＋変動',
          '安全性 （破壊）',
          '復旧性 （損傷）地震時以外',
          '復旧性 （損傷）地震時' 
        ];
        // 古い入力を取っておく
        const old_shear: number[] = new Array();
        for(let i=0; i<keys_shear.length;i++){
          if(this.pickup_shear_force.length>i){
            old_shear.push(this.pickup_shear_force[i].no);
          }else {
            old_shear.push(null);
          }
        }
        this.pickup_shear_force = new Array();
        for(let i=0; i<keys_shear.length;i++){
          this.pickup_shear_force.push({
            title: keys_shear[i], no: old_shear[i]
          });
        }


        this.specification2_list = [
          { id: 0, title: 'ＪＲ各社', selected: true },
          { id: 1, title: '運輸機構', selected: false },
          { id: 2, title: 'ＪＲ東日本', selected: false },
          { id: 3, title: 'ＪＲ西日本', selected: false }
        ];

        this.conditions_list = [
          { id: 'JR-000', title: '縁応力度が制限値以内でも ひび割れ幅の検討を行う',     selected: false },
          { id: 'JR-001', title: 'ひび割れ幅制限値に用いるかぶりは 100mm を上限とする', selected: false },
          { id: 'JR-002', title: 'T形断面でフランジ側引張は矩形断面で計算する',         selected: false },
          { id: 'JR-003', title: '円形断面で鉄筋を頂点に１本配置する',                 selected: false },
          { id: 'JR-004', title: 'せん断耐力におけるβn算定時の Mud は軸力を考慮しない', selected: false }
        ];

        break;

      case 1: // 道路
        this.pickup_moment = new Array();
        this.pickup_shear_force = new Array();
        this.specification2_list = new Array();
        this.conditions_list = new Array();

        break;
      default:
        return;
    }

  }

  public set_specification1(index: number): any {

    const id: number = this.specification1_list.findIndex(
      value => value.id === index);

    this.specification1_list = this.specification1_list.map(
      obj => obj.selected = (obj.id === id) ? true : false);

    this.initSpecificationTitles();

    return this.getSaveData()
  }

  public setSaveData(basic: any){
    this.pickup_moment = basic.pickup_moment;
    this.pickup_shear_force = basic.pickup_shear_force;
    this.specification1_list = basic.specification1_list;
    this.specification2_list = basic.specification2_list;
    this.conditions_list = basic.conditions_list;    
  }

  public setPickUpData(){
  }


  public getSaveData(): any{
    return {
      pickup_moment: this.pickup_moment,
      pickup_shear_force: this.pickup_shear_force,
      specification1_list: this.specification1_list, // 適用
      specification2_list: this.specification2_list, // 仕様
      conditions_list: this.conditions_list         // 設計条件       
    }
  }

}
