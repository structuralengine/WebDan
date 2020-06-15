import { Injectable } from '@angular/core';
import { InputDataService } from '../../providers/input-data.service';

@Injectable({
  providedIn: 'root'
})
export class InputBasicInformationService  {

  // pick up table に関する変数
  public pickup_moment_title: string[];
  public pickup_moment_no: number[];
  public pickup_shear_force_title: string[];
  public pickup_shear_force_no: number[];

  // 適用 に関する変数
  public specification1_list: any[];
  public specification1_selected: number;

  // 仕様 に関する変数
  public specification2_list: any[];
  public specification2_selected: number;

  // 設計条件
  public conditions_list: any[];

  constructor() {
    this.clear();
  }
  public clear(): void {

    this.specification1_selected = 0;
    this.initSpecificationTitles();
    this.specification2_selected = 0;

  }

  /// <summary>
  /// specification1_selected によって変わる項目の設定
  /// </summary>
  public initSpecificationTitles(): void {

    this.specification1_list = [
      { id: 0, title: '鉄道' },
      { id: 1, title: '道路' }
    ];

    switch (this.specification1_selected) {
      case 0: // 鉄道
        this.pickup_moment_title = [
          '耐久性 縁応力度検討用',
          '耐久性 （永久荷重）',
          '安全性 （疲労破壊）疲労限',
          '安全性 （疲労破壊）永久作用',
          '安全性 （疲労破壊）永久＋変動',
          '安全性 （破壊）',
          '復旧性 （損傷）地震時以外',
          '復旧性 （損傷）地震時',
          '耐久性  最小鉄筋量'
        ];

        this.pickup_shear_force_title = [
          '耐久性 せん断ひび割れ検討判定用',
          '耐久性 （永久荷重）',
          '耐久性 （変動荷重）',
          '安全性 （疲労破壊）永久作用',
          '安全性 （疲労破壊）永久＋変動',
          '安全性 （破壊）',
          '復旧性 （損傷）地震時以外',
          '復旧性 （損傷）地震時'
        ];

        this.specification2_list = [
          { id: 0, title: 'ＪＲ各社' },
          { id: 1, title: '運輸機構' },
          { id: 2, title: 'ＪＲ東日本' },
          { id: 3, title: 'ＪＲ西日本' }
        ];

        this.conditions_list = [
          { id: 'JR-000', title: '縁応力度が制限値以内でも ひび割れ幅の検討を行う', selected: false },
          { id: 'JR-001', title: 'ひび割れ幅制限値に用いるかぶりは 100mm を上限とする', selected: false },
          { id: 'JR-002', title: 'T形断面でフランジ側引張は矩形断面で計算する', selected: false },
          { id: 'JR-003', title: '円形断面で鉄筋を頂点に１本配置する', selected: false },
          { id: 'JR-004', title: 'せん断耐力におけるβn算定時の Mud は軸力を考慮しない', selected: false }
        ];

        this.pickup_moment_no = new Array();
        this.pickup_moment_no.push(0);        // 耐久性 縁応力度検討用
        this.pickup_moment_no.push(1);        // 耐久性 （永久荷重）
        this.pickup_moment_no.push(null);     // 安全性 （疲労破壊）疲労限
        this.pickup_moment_no.push(2);        // 安全性 （疲労破壊）永久作用
        this.pickup_moment_no.push(3);        // 安全性 （疲労破壊）永久＋変動
        this.pickup_moment_no.push(4);        // 安全性 （破壊）
        this.pickup_moment_no.push(5);        // 復旧性 （損傷）地震時以外
        this.pickup_moment_no.push(6);        // 復旧性 （損傷）地震時
        this.pickup_moment_no.push(null);     // 耐久性  最小鉄筋量
        // せん断力 手入力
        this.pickup_shear_force_no = new Array();
        this.pickup_shear_force_no.push(0);   // 耐久性 せん断ひび割れ検討判定用
        this.pickup_shear_force_no.push(1);   // 耐久性 （永久荷重）
        this.pickup_shear_force_no.push(2);   // 耐久性 （変動荷重）
        this.pickup_shear_force_no.push(3);   // 安全性 （疲労破壊）永久作用
        this.pickup_shear_force_no.push(4);   // 安全性 （疲労破壊）永久＋変動
        this.pickup_shear_force_no.push(5);   // 安全性 （破壊）
        this.pickup_shear_force_no.push(6);   // 復旧性 （損傷）地震時以外
        this.pickup_shear_force_no.push(7);   // 復旧性 （損傷）地震時

        break;

      case 1: // 道路
        this.pickup_moment_title = new Array();
        this.pickup_moment_no = new Array(this.pickup_moment_title.length);
        this.pickup_shear_force_title = new Array();
        this.pickup_shear_force_no = new Array(this.pickup_shear_force_title.length);
        this.specification2_list = new Array();
        this.conditions_list = new Array();

        break;
      default:
        return;
    }

  }

  public pickup_moment_count(): number {
    return this.pickup_moment_title.length;
  }
  public pickup_shear_force_count(): number {
    return this.pickup_shear_force_title.length;
  }

  /// <summary>
  /// basic-information.component の
  /// pickup_moment_datarows のデータを返す関数
  /// </summary>
  /// <param name="row">行番号</param>
  public getPickUpNoMomentColumns(row: number): any {
    if ( this.pickup_moment_no.length === 0 ) {
      const a = 0;
    }
    const result = {
      row: row,
      title: this.pickup_moment_title[row],
      pickup_no: this.pickup_moment_no[row]
    };
    return result;
  }
  public setPickUpNoMomentColumns(row: number, value: number): void {
    this.pickup_moment_no[row] = value;
  }

  /// <summary>
  /// basic-information.component の
  /// pickup_shear_force_datarows のデータを返す関数
  /// </summary>
  /// <param name="row">行番号</param>
  public getPickUpNoShearForceColumns(row: number): any {
    const result = {
      row: row,
      title: this.pickup_shear_force_title[row],
      pickup_no: this.pickup_shear_force_no[row]
    };
    return result;
  }

  public setPickUpNoShearForceColumns(row: number, value: number): void {
    this.pickup_shear_force_no[row] = value;
  }

  /// <summary>
  /// basic-information.component の
  /// conditions_list のデータを返す関数
  /// </summary>
  /// <param name="row">識別番号</param>
  public setConditions(id: string, isChecked: boolean): void {
    for (let i = 0; i < this.conditions_list.length; i++) {
      const tmp = this.conditions_list[i];
      if (tmp.id === id) {
        tmp.selected = isChecked;
        return;
      }
    }
  }

  public setPickUpData(isManualed:boolean){
    if (isManualed) {
      // マニュアルモードからピックアップモードに切り替わる時
      // マニュアルモード用のピックアップ番号をクリアする
      this.pickup_moment_no = new Array(this.pickup_moment_title.length);
      this.pickup_shear_force_no = new Array(this.pickup_shear_force_title.length);
    }
  }

}
