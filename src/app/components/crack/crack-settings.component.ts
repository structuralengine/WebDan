import { Component, OnInit, QueryList, OnDestroy, ViewChildren } from '@angular/core';
import pq from 'pqgrid';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SaveDataService } from 'src/app/providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import { InputCrackSettingsService } from './crack-settings.service';

@Component({
  selector: 'app-crack-settings',
  templateUrl: './crack-settings.component.html',
  styleUrls: ['./crack-settings.component.scss']
})
export class CrackSettingsComponent implements OnInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[]= new Array();

  private table_datas: any[][];

  constructor(
    private crack: InputCrackSettingsService,
    private save: SaveDataService,
    public helper: DataHelperModule) { }

  ngOnInit() {

    this.setTitle(this.save.isManual());

    this.table_datas = this.crack.getTableColumns();

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
        { title: '部材\n番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '位置', dataType: 'float', format: '#.000', dataIndx: 'position', editable: false, sortable: false, width: 110, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      ];    
    }

    // 共通する項目
    this.columnHeaders.push(
      { title: '算出点名', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      {
        title: '環境条件', align: 'center', colModel: [
          { title: '上側', dataType: 'integer', dataIndx: 'con_u', sortable: false, width: 60 },
          { title: '下側', dataType: 'integer', dataIndx: 'con_l', sortable: false, width: 60 },
          { title: 'せん断', dataType: 'integer', dataIndx: 'con_s', sortable: false, width: 60 }
        ]
      },
      {
        title: '外観', align: 'center', colModel: [
          { title: '上側', align: 'center', dataType: 'bool', dataIndx: 'vis_u', type: 'checkbox', sortable: false, width: 50 },
          { title: '下側', align: 'center', dataType: 'bool', dataIndx: 'vis_l', type: 'checkbox', sortable: false, width: 50 }
        ]
      },
      { title: 'ひび割<br/>εcsd', align: 'center', dataType: 'integer', dataIndx: 'ecsd', sortable: false, width: 70 },
      { title: 'せん断<br/>kr', dataType: 'float', format: '#.0', dataIndx: 'kr', sortable: false, width: 70 },
    );
  }

 
  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
    this.crack.setSaveData(this.table_datas);
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
