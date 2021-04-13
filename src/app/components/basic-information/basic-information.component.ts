import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { InputBasicInformationService } from './basic-information.service';
import { SaveDataService } from '../../providers/save-data.service';
import { InputMembersService } from '../members/members.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('grid1') grid1: SheetComponent;
  private columnHeaders: object[] = [
    { title: '断面照査に用いる応力', dataType: 'string',  dataIndx: 'title', editable: false, sortable: false, width: 270, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: 'Pickup No', align: 'center', dataType: 'integer', dataIndx: 'pickup_no', sortable: false, width: 148 },
  ];
  private pickup_moment_datarows: any[] = [];
  public options1: pq.gridT.options;

  @ViewChild('grid2') grid2: SheetComponent;
  private pickup_shear_force_datarows: any[] = [];
  public options2: pq.gridT.options;

  public isSRC: boolean; // SRC部材 があるかどうか

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

    this.initPickupTable();
    
    this.options1 = {
      height: 290,
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      numberCell: { show: true }, // 行番号
      colModel: this.columnHeaders,
      dataModel: { data: this.pickup_moment_datarows },
    };

    this.options2 = {
      height: 290,
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      numberCell: { show: true }, // 行番号
      colModel: this.columnHeaders,
      dataModel: { data: this.pickup_shear_force_datarows },
    };

  }

  public isManual(): boolean{
    return this.save.isManual();
  }

  ngAfterViewInit(){
    if(this.isManual() === false) {
      this.grid1.options = this.options1;
      this.grid1.refreshDataAndView();

      this.grid2.options = this.options2;
      this.grid2.refreshDataAndView();
    }
  }

  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
    let i: number = 0;
    for (let row = 0; row < this.pickup_moment_datarows.length; row++) {
      const column = this.pickup_moment_datarows[row];

      if (this.input.specification1_selected === 0  // 鉄道
        && row === 2                          // 安全性 （疲労破壊）疲労限
        && this.isSRC === false) {            // SRC部材 がない
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
  /// <param name='i'>選択された番号</param>
  private initPickupTable(): void {

    this.pickup_moment_datarows = new Array();
    this.pickup_shear_force_datarows = new Array();

    for (let row = 0; row < this.input.pickup_moment_title.length; row++) {
      const column = this.input.getPickUpNoMomentColumns(row);

      if (row === 2) { //  安全性 （疲労破壊）疲労限
        if (this.input.specification1_selected === 0) { // 鉄道
          if (this.isSRC === false) { // SRC部材 がない
            continue;
          }
        }
      }
      this.pickup_moment_datarows.push(column);
    }

    for (let row = 0; row < this.input.pickup_shear_force_title.length; row++) {
      const column = this.input.getPickUpNoShearForceColumns(row);
      this.pickup_shear_force_datarows.push(column);
    }

  }

  /// <summary>
  /// 適用 変更時の処理
  /// </summary>
  /// <param name='i'>選択された番号</param>
  public setSpecification1(i: number): void {

    this.input.specification1_selected = i;
    this.input.initSpecificationTitles();

    // 適用 に関する変数 の初期化
    this.input.specification1_selected = i;
    this.input.specification1_list = this.input.specification1_list;

    // 仕様 に関する変数 の初期化
    this.setSpecification2(this.input.specification2_selected);
    this.input.specification2_list = this.input.specification2_list;

    //  設計条件 に関する初期化
    this.input.conditions_list = this.input.conditions_list;

    // pickup_table に関する初期化
    this.initPickupTable();

  }

  /// <summary>
  /// 仕様 変更時の処理
  /// </summary>
  /// <param name='i'>選択された番号</param>
  public setSpecification2(i: number): void {
    this.input.specification2_selected = i;
  }

  /// <summary>
  /// 設計条件 変更時の処理
  /// </summary>
  /// <param name='item'>変更されたアイテム</param>
  /// <param name='isChecked'>チェックボックスの状態</param>
  public conditionsCheckChanged(id: string, isChecked: boolean) {
    this.input.setConditions(id, isChecked);
    this.input.conditions_list = this.input.conditions_list;
  }

}
