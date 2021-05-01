import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class InputBasicInformationService  {

  // pick up table に関する変数
  private pickup_moment: any[];
  private pickup_shear_force: any[];

  // 適用 に関する変数
  private specification1_list: any[];

  // 仕様 に関する変数
  private specification2_list: any[];

  // 設計条件
  public conditions_list: any[];

  constructor(private helper: DataHelperModule) {
    this.clear();
  }
  public clear(): void {
    this.pickup_moment = new Array();
    this.pickup_shear_force = new Array();
    this.specification1_list = new Array();
    this.specification2_list = new Array();
    this.conditions_list = new Array();

    this.set_default_specification1();
    this.set_default_pickup();
  }

  private set_default_specification1(): void {
    this.specification1_list = [
      { id: 0, title: '鉄道', selected: true },
      { id: 1, title: '道路', selected: false }
    ];
  }
  /// get_specification1 によって変わる項目の設定
  private set_default_pickup(): void {

    switch (this.get_specification1()) {
      case 0: // 鉄道

        // 曲げモーメントテーブル
        const keys_moment = [
          { id: 0, title: '耐久性 縁応力度検討用', no: null},
          { id: 1, title: '耐久性 （永久荷重）', no: null},
          { id: 2, title: '安全性 （疲労破壊）疲労限', no: null},
          { id: 3, title: '安全性 （疲労破壊）永久作用', no: null},
          { id: 4, title: '安全性 （疲労破壊）永久＋変動', no: null},
          { id: 5, title: '安全性 （破壊）', no: null},
          { id: 6, title: '復旧性 （損傷）地震時以外', no: null},
          { id: 7, title: '復旧性 （損傷）地震時', no: null}
        ];
        // 古い入力があれば no の入力を 保持
        const tmp_moment: any[] = new Array();
        for(const def of keys_moment){
          const old = this.pickup_moment.find(v=>v.id===def.id);
          if(old!==undefined){
            def.no = old.no;
          }
          tmp_moment.push(def);
        }
        this.pickup_moment = tmp_moment;

        // せん断力テーブル
        const keys_shear = [
          { id: 0, title: '耐久性 せん断ひび割れ検討判定用', no: null},
          { id: 1, title: '耐久性 （永久荷重）', no: null},
          { id: 2, title: '耐久性 （変動荷重）', no: null},
          { id: 3, title: '安全性 （疲労破壊）永久作用', no: null},
          { id: 4, title: '安全性 （疲労破壊）永久＋変動', no: null},
          { id: 5, title: '安全性 （破壊）', no: null},
          { id: 6, title: '復旧性 （損傷）地震時以外', no: null},
          { id: 7, title: '復旧性 （損傷）地震時', no: null}
        ];
        // 古い入力があれば no の入力を 保持
        const tmp_shear: any[] = new Array();
        for(const def of keys_shear){
          const old = this.pickup_shear_force.find(v=>v.id===def.id);
          if(old!==undefined){
            def.no = old.no;
          }
          tmp_shear.push(def);
        }
        this.pickup_shear_force = tmp_shear;

        this.specification2_list = [
          { id: 0, title: 'ＪＲ各社', selected: true },
          { id: 1, title: '運輸機構', selected: false },
          { id: 2, title: 'ＪＲ東日本', selected: false },
          { id: 3, title: 'ＪＲ西日本', selected: false }
        ];

        this.conditions_list = [
          { id: 'JR-000', title: '縁応力度が制限値以内でも ひび割れ幅の検討を行う',     selected: false },
          { id: 'JR-001', title: 'ひび割れ幅制限値に用いるかぶりは 100mm を上限とする', selected: true },
          { id: 'JR-002', title: 'T形断面でフランジ側引張は矩形断面で計算する',         selected: true },
          { id: 'JR-003', title: '円形断面で鉄筋を頂点に１本配置する',                 selected: true },
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

  public pickup_moment_no(id: number){
    const old = this.pickup_moment.find(v=>v.id===id);
    if(old!==undefined){
      return this.helper.toNumber(old.no);
    }
    return null;
  }
  public pickup_shear_force_no(id: number){
    const old = this.pickup_moment.find(v=>v.id===id);
    if(old!==undefined){
      return this.helper.toNumber(old.no);
    }
    return null;
  }

  public get_specification1(): number {
    const sp = this.specification1_list.find(
      value=>value.selected === true);

    return sp.id;
  }

  public get_specification2(): number {
    const sp = this.specification2_list.find(
      value=>value.selected === true);

    return sp.id;
  }
  public set_specification1(index: number): any {

    const id: number = this.specification1_list.findIndex(
      value => value.id === index);

    this.specification1_list = this.specification1_list.map(
      obj => obj.selected = (obj.id === id) ? true : false);

    this.set_default_pickup();

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
