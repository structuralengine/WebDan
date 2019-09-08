import { Component, OnInit } from '@angular/core';
import { InputBasicInformationService } from './input-basic-information.service';
import { SaveDataService } from '../../providers/save-data.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit {

  // pickup_table に関する変数
  pickup_moment_title = 'ピックアップ (曲げ耐力用)';
  pickup_shear_force_title = 'ピックアップ (せん断耐力用)';
  pickup_moment_datarows: any[];
  pickup_shear_force_datarows: any[];
  pickup_title_column_header = '断面照査に用いる応力';
  isManual: boolean;
  pickup_table_settings = {
    beforeChange: (source, changes) => {

      try {
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
    private save: SaveDataService) {

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

    // pickup_table に関する初期化
    this.initPickupTable();

    this.isManual = this.save.isManual();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {

    for (let row = 0; row < this.pickup_moment_datarows.length; row++) {
      const column = this.pickup_moment_datarows[row];
      this.input.setPickUpNoMomentColumns(row, column['pickup_no']);
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

    if(this.save.isManual() === true){
      this.input.pickup_moment_no = new Array();
      for (let i = 0; i < this.pickup_moment_title.length; i++) {
        this.input.pickup_moment_no.push(i + 1);
      }
      this.input.pickup_shear_force_no = new Array();
      for (let i = 0; i < this.pickup_shear_force_title.length; i++) {
        this.input.pickup_shear_force_no.push(i + 1);
      }
    }

    this.pickup_moment_datarows = new Array();
    this.pickup_shear_force_datarows = new Array();

    for (let row = 0; row < this.input.pickup_moment_count(); row++) {
      const column = this.input.getPickUpNoMomentColumns(row);
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
