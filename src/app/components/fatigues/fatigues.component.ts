import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { InputFatiguesService } from './fatigues.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';
import { AppComponent } from 'src/app/app.component';
import { SaveDataService } from 'src/app/providers/save-data.service';

@Component({
  selector: 'app-fatigues',
  templateUrl: './fatigues.component.html',
  styleUrls: ['./fatigues.component.scss']
})
export class FatiguesComponent implements OnInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[] = new Array();

  private table_datas: any[][];

  public train_A_count: number;
  public train_B_count: number;
  public service_life: number;

  constructor(
    private fatigues: InputFatiguesService,
    private save: SaveDataService) { }

  ngOnInit() {

    this.setTitle(this.save.isManual());

    this.table_datas = this.fatigues.getTableColumns();

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
        dataModel: { data: this.table_datas[i] },
      };
      this.options.push(op);
      this.grids[i].options = op;
    }

    const fatigues = this.fatigues.getSaveData();
    this.train_A_count = fatigues.fatigues.train_A_count;
    this.train_B_count = fatigues.fatigues.train_B_count;
    this.service_life = fatigues.fatigues.service_life;
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
      {
        title: '曲げ用', align: 'center', colModel: [
          { title: 'SA/SC', dataType: 'float', format: '#.000', dataIndx: 'M_SA', sortable: false, width: 70 },
          { title: 'SB/SC', dataType: 'float', format: '#.000', dataIndx: 'M_SB', sortable: false, width: 70 },
          {
            title: 'k=0.06', align: 'center', colModel: [
              { title: 'NA', dataType: 'float', format: '#.00', dataIndx: 'M_NA06', sortable: false, width: 70 },
              { title: 'NB', dataType: 'float', format: '#.00', dataIndx: 'M_NB06', sortable: false, width: 70 }
            ]
          },
          {
            title: 'k=0.12', align: 'center', colModel: [
              { title: 'NA', dataType: 'float', format: '#.00', dataIndx: 'M_NA12', sortable: false, width: 70 },
              { title: 'NB', dataType: 'float', format: '#.00', dataIndx: 'M_NB12', sortable: false, width: 70 }
            ]
          },
          {
            title: '複線補正r2', align: 'center', colModel: [
              { title: 'α', dataType: 'float', format: '#.000', dataIndx: 'M_A', sortable: false, width: 70 },
              { title: 'β', dataType: 'float', format: '#.000', dataIndx: 'M_B', sortable: false, width: 70 }
            ]
          },
          {
            title: '曲げ加工 r1', align: 'center', colModel: [
              { title: '軸鉄筋', dataType: 'float', format: '#.00', dataIndx: 'r1_1', sortable: false, width: 60 },
              { title: '帯筋', dataType: 'float', format: '#.00', dataIndx: 'r1_2', sortable: false, width: 60 },
              { title: '折曲げ', dataType: 'float', format: '#.00', dataIndx: 'r1_3', sortable: false, width: 60 }
            ]
          },
        ]
      },
      {
        title: 'せん断用', align: 'center', colModel: [
          { title: 'SA/SC', dataType: 'float', format: '#.000', dataIndx: 'V_SA', sortable: false, width: 70 },
          { title: 'SB/SC', dataType: 'float', format: '#.000', dataIndx: 'V_SB', sortable: false, width: 70 },
          {
            title: 'k=0.06', align: 'center', colModel: [
              { title: 'NA', dataType: 'float', format: '#.00', dataIndx: 'V_NA06', sortable: false, width: 70 },
              { title: 'NB', dataType: 'float', format: '#.00', dataIndx: 'V_NB06', sortable: false, width: 70 }
            ]
          },
          {
            title: 'k=0.12', align: 'center', colModel: [
              { title: 'NA', dataType: 'float', format: '#.00', dataIndx: 'V_NA12', sortable: false, width: 70 },
              { title: 'NB', dataType: 'float', format: '#.00', dataIndx: 'V_NB12', sortable: false, width: 70 }
            ]
          },
          {
            title: '複線補正r2', align: 'center', colModel: [
              { title: 'α', dataType: 'float', format: '#.000', dataIndx: 'V_A', sortable: false, width: 70 },
              { title: 'β', dataType: 'float', format: '#.000', dataIndx: 'V_B', sortable: false, width: 70 }
            ]
          },
          {
            title: '曲げ加工 r1', align: 'center', colModel: [
              { title: '軸鉄筋', dataType: 'float', format: '#.00', dataIndx: 'r1_1', sortable: false, width: 60 },
              { title: '帯筋', dataType: 'float', format: '#.00', dataIndx: 'r1_2', sortable: false, width: 60 },
              { title: '折曲げ', dataType: 'float', format: '#.00', dataIndx: 'r1_3', sortable: false, width: 60 }
            ]
          },
        ]
      }
    );
  }

 
  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
    this.fatigues.setSaveData({
      table_datas: this.table_datas,
      train_A_count: this.train_A_count,
      train_B_count: this.train_B_count,
      service_life: this.service_life
    });
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
