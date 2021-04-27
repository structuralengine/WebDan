import { Component, OnInit, ViewChild, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { InputSteelsService } from './steels.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SaveDataService } from 'src/app/providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-steels',
  templateUrl: './steels.component.html',
  styleUrls: ['./steels.component.scss']
})
export class SteelsComponent implements OnInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[] = new Array();
  public table_datas: any[];

  constructor(
    private steel: InputSteelsService,
    private save: SaveDataService) { }

  ngOnInit() {

    this.setTitle(this.save.isManual());

    this.table_datas = this.steel.getTableColumns();

    // グリッドの設定
    this.options = new Array();
    for( let i =0; i < this.table_datas.length; i++){
      const op = {
        showTop: false,
        reactive: true,
        sortable: false,
        locale: "jp",
        height: this.tableHeight().toString(),
        numberCell: { show: this.save.isManual() }, // 行番号
        colModel: this.columnHeaders,
        dataModel: { data: this.table_datas[i] }
      };
      this.options.push(op);
      this.grids[i].options = op;
    }

  }

  private setTitle(isManual: boolean): void{
    if (isManual) {
      // 断面力手入力モードの場合
      this.columnHeaders = [
        { title: '', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      ];
    } else {
      this.columnHeaders = [
        { title: '部材<br/>番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '位置', dataType: 'float', format: '#.000', dataIndx: 'position', editable: false, sortable: false, width: 110, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      ];    
    }

    // 共通する項目
    this.columnHeaders.push(
      { title: '算出点名', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: '断面<br/>B<br/>H', align: 'center', dataType: 'float', dataIndx: 'bh', editable: false, sortable: false, width: 85, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: '位置', align: 'center', dataType: 'string', dataIndx: 'design_point_id', editable: false, sortable: false, width: 40, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: '上または左からの距離',  dataType: 'float', dataIndx: 'upper_left_cover', sortable: false, width: 70 },
      {
        title: '上フランジ または 左フランジ', align: 'center', colModel: [
          { title: 'フランジ幅', dataType: 'float', dataIndx: 'upper_left_width', sortable: false, width: 80 },
          { title: 'フランジ厚', dataType: 'float', dataIndx: 'upper_left_thickness', sortable: false, width: 80 },
        ]
      },
      {
        title: 'ウェブ', align: 'center', colModel: [
          { title: 'ウェブ厚', dataType: 'float', dataIndx: 'web_thickness', sortable: false, width: 80 },
          { title: 'ウェブ高', dataType: 'float', dataIndx: 'web_height', sortable: false, width: 80 },
        ]
      },
      {
        title: '下フランジ または 右フランジ', align: 'center', colModel: [
          { title: 'フランジ幅', dataType: 'float', dataIndx: 'lower_right_width', sortable: false, width: 80 },
          { title: 'フランジ厚', dataType: 'float', dataIndx: 'lower_right_thickness', sortable: false, width: 80 },
        ]
      },
      { title: '処理', align: 'center', dataType: 'bool', dataIndx: 'enable', type: 'checkbox', sortable: false, width: 40 },
    );
  }


 
  ngOnDestroy() {
    this.saveData();
  }
  public saveData(): void {
    this.steel.setSaveData(this.table_datas);
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = window.innerHeight;
    containerHeight -= 230;
    return containerHeight;
  }

  public getGroupeName(i: number): string {
    const target = this.table_datas[i];
    const first = target[0];
    let result: string = '';
    if(first.g_name === null){
      result = first.g_id;
    } else if(first.g_name === ''){
      result = first.g_id;
    } else {
      result = first.g_name;
    }
    if(result === ''){
      result = 'No' + i;
    }
    return result;
  }

}
