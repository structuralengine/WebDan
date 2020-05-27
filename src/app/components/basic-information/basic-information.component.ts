import { Component, OnInit, OnDestroy } from '@angular/core';
import { InputBasicInformationService } from './input-basic-information.service';
import { SaveDataService } from '../../providers/save-data.service';
import { InputMembersService } from '../members/input-members.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, OnDestroy {

  // pickup_table に関する変数
  pickup_moment_title = 'ピックアップ (曲げ耐力用)';
  pickup_shear_force_title = 'ピックアップ (せん断耐力用)';
  pickup_moment_datarows: any[];
  pickup_shear_force_datarows: any[];
  pickup_title_column_header = '断面照査に用いる応力';
  isManual: boolean;
  isSRC: boolean; // SRC部材 があるかどうか


  pickup_table_settings = {
    beforeChange: (... x: any[]) => {
      try {
        let changes: any = undefined;
        for(let i = 0; i < x.length; i++){
          if(Array.isArray(x[i])){
            changes = x[i];
            break;
          }
        }
        if(changes === undefined){return;}
        for (let i = 0; i < changes.length; i++) {
          const value: number = this.input.toNumber(changes[i][3]);
          if (value === null) {
            changes[i][3] = null;
          }
        }
      } catch (e) {
        console.log(e);
      }

    },
    afterChange: (hotInstance, changes, source) => {
    }
  };

  // 適用 に関する変数
  specification1_selected: number;
  specification1_list: any[];

  // 仕様 に関する変数
  specification2_selected: number;
  specification2_list: any[];

  // 設計条件
  conditions_list: any[];

  constructor(
    private input: InputBasicInformationService,
    private save: SaveDataService,
    private member: InputMembersService) {

  }

  ngOnInit() {

    // 適用 に関する変数 の初期化
    this.specification1_selected = this.input.specification1_selected;
    this.specification1_list = this.input.specification1_list;

    // 仕様 に関する変数 の初期化
    this.specification2_selected = this.input.specification2_selected;
    this.specification2_list = this.input.specification2_list;

    //  設計条件 に関する初期化
    this.conditions_list = this.input.conditions_list;

    // SRC部材 があるかどうか
    this.isSRC = this.member.getSRC().some((v) => v > 0);

    // pickup_table に関する初期化
    this.initPickupTable();

    this.isManual = this.save.isManual();

  }

  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
    let i: number = 0;      
    for (let row = 0; row < this.pickup_moment_datarows.length; row++) {
      const column = this.pickup_moment_datarows[row];

      if (this.specification1_selected === 0  // 鉄道
        && row === 2                          // 安全性 （疲労破壊）疲労限
        && this.isSRC === false ){            // SRC部材 がない
          i++;
      }

      this.input.setPickUpNoMomentColumns(row + i, column['pickup_no']);
    }

    for (let row = 0; row < this.pickup_shear_force_datarows.length; row++) {
      const column = this.pickup_shear_force_datarows[row];
      this.input.setPickUpNoShearForceColumns(row, column['pickup_no']);
    }
  }

  /// <summary>
  /// pick up table の初期化関数
  /// </summary>
  /// <param name="i">選択された番号</param>
  private initPickupTable(): void {

    if (this.save.isManual() === true) {
      // 曲げモーメント 手入力
      this.input.pickup_moment_no = new Array();
      this.input.pickup_moment_no.push(0);        // 耐久性 縁応力度検討用
      this.input.pickup_moment_no.push(1);        // 耐久性 （永久荷重）
      this.input.pickup_moment_no.push(null);     // 安全性 （疲労破壊）疲労限
      this.input.pickup_moment_no.push(2);        // 安全性 （疲労破壊）永久作用
      this.input.pickup_moment_no.push(3);        // 安全性 （疲労破壊）永久＋変動
      this.input.pickup_moment_no.push(4);        // 安全性 （破壊）
      this.input.pickup_moment_no.push(5);        // 復旧性 （損傷）地震時以外
      this.input.pickup_moment_no.push(6);        // 復旧性 （損傷）地震時
      this.input.pickup_moment_no.push(null);     // 耐久性  最小鉄筋量
      // せん断力 手入力
      this.input.pickup_shear_force_no = new Array();
      this.input.pickup_shear_force_no.push(0);   // 耐久性 せん断ひび割れ検討判定用
      this.input.pickup_shear_force_no.push(1);   // 耐久性 （永久荷重）
      this.input.pickup_shear_force_no.push(2);   // 耐久性 （変動荷重）
      this.input.pickup_shear_force_no.push(3);   // 安全性 （疲労破壊）永久作用
      this.input.pickup_shear_force_no.push(4);   // 安全性 （疲労破壊）永久＋変動
      this.input.pickup_shear_force_no.push(5);   // 安全性 （破壊）
      this.input.pickup_shear_force_no.push(6);   // 復旧性 （損傷）地震時以外
      this.input.pickup_shear_force_no.push(7);   // 復旧性 （損傷）地震時
    }

    this.pickup_moment_datarows = new Array();
    this.pickup_shear_force_datarows = new Array();

    for (let row = 0; row < this.input.pickup_moment_count(); row++) {
      const column = this.input.getPickUpNoMomentColumns(row);

      if (this.specification1_selected === 0) { // 鉄道
        if (row === 2) { //  安全性 （疲労破壊）疲労限
          if (this.isSRC === false) { // SRC部材 がない
            continue;
          }
        }
      }
      
      this.pickup_moment_datarows.push(column);
    }

    for (let row = 0; row < this.input.pickup_shear_force_count(); row++) {
      const column = this.input.getPickUpNoShearForceColumns(row);
      this.pickup_shear_force_datarows.push(column);
    }

  }

  /// <summary>
  /// 適用 変更時の処理
  /// </summary>
  /// <param name="i">選択された番号</param>
  setSpecification1(i: number): void {

    this.input.specification1_selected = i;
    this.input.initSpecificationTitles();

    // 適用 に関する変数 の初期化
    this.specification1_selected = i;
    this.specification1_list = this.input.specification1_list;

    // 仕様 に関する変数 の初期化
    this.setSpecification2(this.input.specification2_selected);
    this.specification2_list = this.input.specification2_list;

    //  設計条件 に関する初期化
    this.conditions_list = this.input.conditions_list;

    // pickup_table に関する初期化
    this.initPickupTable();

  }

  /// <summary>
  /// 仕様 変更時の処理
  /// </summary>
  /// <param name="i">選択された番号</param>
  setSpecification2(i: number): void {
    this.input.specification2_selected = i;
  }

  /// <summary>
  /// 設計条件 変更時の処理
  /// </summary>
  /// <param name="item">変更されたアイテム</param>
  /// <param name="isChecked">チェックボックスの状態</param>
  conditionsCheckChanged(id: string, isChecked: boolean) {
    this.input.setConditions(id, isChecked);
    this.conditions_list = this.input.conditions_list;
  }



}
