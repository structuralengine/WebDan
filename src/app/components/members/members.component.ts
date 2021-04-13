import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputMembersService } from './members.service';
import { SheetComponent } from '../sheet/sheet.component';
import { AppComponent } from 'src/app/app.component';
import pq from 'pqgrid';
import { SaveDataService } from 'src/app/providers/save-data.service';
import { CalcRestorabilityMomentService } from 'src/app/calculation/result-restorability-moment/calc-restorability-moment.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})


export class MembersComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: SheetComponent;
  public options: pq.gridT.options;
  private columnHeaders: object[] = [];

  private ROWS_COUNT = 0;
  private mambers_table_datarows: any[] = [];

  constructor(
    private app: AppComponent,
    private save: SaveDataService,
    private input: InputMembersService) {
  }

  ngOnInit() {
    if(this.save.isManual() ){
      // 断面力て入力モードの場合の項目
      this.columnHeaders = [];
    } else {
      // ピックアップファイルを使う場合の項目
      this.columnHeaders = [
        { title: '部材<br/>番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '部材長', dataType: 'float', format: '#.000', dataIndx: 'm_len', editable: false, sortable: false, width: 90, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      ];
    }
    this.columnHeaders.push(
      { title: 'グループNo', align: 'center', dataType: 'string', dataIndx: 'g_id', sortable: false, width: 85 },
      { title: '部材名', align: 'center', dataType: 'string', dataIndx: 'g_name', sortable: false, width: 110 },
      { title: '断面形状', dataType: 'string', dataIndx: 'shape', sortable: false, width: 80 },
      {
        title: '断面(mm)', align: 'center', colModel: [
          { title: 'B', dataType: 'float', dataIndx: 'B', width: 70 },
          { title: 'H', dataType: 'float', dataIndx: 'H', width: 70 },
          { title: 'Bt', dataType: 'float', dataIndx: 'Bt', width: 70 },
          { title: 't', dataType: 'float', dataIndx: 't', width: 70 }
        ]
      },
      { title: '部材数', align: 'center', dataType: 'float', dataIndx: 'n', sortable: false, width: 80 },
    );


    // グリッドの基本的な オプションを登録する
    this.options = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      height: this.tableHeight().toString(),
      width: 'auto',
      numberCell: { show: this.save.isManual() }, // 行番号
      colModel: this.columnHeaders,
      change: (evt, ui) => {
        for (const property of ui.updateList) {
          for (const key of Object.keys(property.newRow)) {
            const old = property.oldRow[key];
            const i = property.rowIndx;
            if (key === 'g_id') {
              // 他の共通断面
              const value = this.save.getGroupeNo(property.newRow[key]);
              if (value === null) {
                this.mambers_table_datarows[i].g_id = '';
                continue;
              }
              // 初期値は対象にしない
              for (let j = 0; j < this.mambers_table_datarows.length; j++) {
                if (property.rowIndx === j) { continue; }                      // 同じ行は比較しない
                const targetColumn = this.mambers_table_datarows[j];
                const target = this.save.getGroupeNo(targetColumn.g_id);
                if (target === null) { continue; } // 初期値は対象にしない
                if (target === value) {
                  this.mambers_table_datarows[i].g_name = targetColumn.g_name;
                }
              }
              this.mambers_table_datarows[i].g_id = value.toString();
            } else if (key === 'g_name') {
              // 他の共通断面
              let value = property.newRow[key];
              if (value === null) { continue; }         // 初期値は対象にしない
              value = value.trim();
              if (value === '') { continue; }
              for (let j = 0; j < this.mambers_table_datarows.length; j++) {
                const targetColumn = this.mambers_table_datarows[j];
                if (property.rowIndx === j) {
                  targetColumn.g_name = value;
                  continue;
                }                      // 同じ行は比較しない
                const target = this.save.getGroupeNo(targetColumn.g_id);
                if (this.save.getGroupeNo(target) === null) { continue; } // 初期値は対象にしない
                const row = property.rowIndx;
                const changesColumn = this.mambers_table_datarows[row];
                const current = this.save.getGroupeNo(changesColumn.g_id);
                if (target === current) {
                  targetColumn.g_name = value;
                }
              }
            } else if (key === 'shape') {
              let value = property.newRow[key];
              const row = property.rowIndx;
              if (value === null) { continue; }         // 初期値は対象にしない
              value = value.trim();
              switch (value) {
                case '1':
                case 'RC-矩形':
                  this.mambers_table_datarows[row].shape = 'RC-矩形';
                  break;
                case '2':
                case 'RC-T形':
                  this.mambers_table_datarows[row].shape = 'RC-T形';
                  break;
                case '3':
                case 'RC-円形':
                  this.mambers_table_datarows[row].shape = 'RC-円形';
                  break;
                case '4':
                case 'RC-小判':
                  this.mambers_table_datarows[row].shape = 'RC-小判';
                  break;
                case '11':
                case 'SRC-矩形':
                  this.mambers_table_datarows[row].shape = 'SRC-矩形';
                  break;
                case '12':
                case 'SRC-T形':
                  this.mambers_table_datarows[row].shape = 'SRC-T形';
                  break;
                case '13':
                case 'SRC-円形':
                  this.mambers_table_datarows[row].shape = 'SRC-円形';
                  break;
                default:
                  this.mambers_table_datarows[row].shape = '';
              }
            }
            if(this.isEnable(this.mambers_table_datarows[i])){
              this.app.memberEnable(true)
            }
          }
        }

      }
    };

    // データを読み込む
    if (this.save.isManual() === true) {
      // 断面手入力モードの場合は、無限ループ
      this.ROWS_COUNT = this.rowsCount();
      this.options['beforeTableView'] =  (evt, ui) => {
        const dataV = this.mambers_table_datarows.length;
        if (ui.initV == null) {
          return;
        }
        if (ui.finalV >= dataV - 1) {
          this.loadData(dataV + this.ROWS_COUNT);
          this.grid.refreshDataAndView();
        }
      }
    } else {
      // ピックアップファイルを使う場合
      this.mambers_table_datarows = this.input.member_list;
    }

    // データを登録する
    this.options['dataModel'] = { data: this.mambers_table_datarows };
  }

  // 指定行row 以降のデータを読み取る
  private loadData(row: number): void {
    for (let i = this.mambers_table_datarows.length + 1; i <= row; i++) {
      const node = this.input.getMemberTableColumns(i);
      this.mambers_table_datarows.push(node);
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {

    if ( !this.save.isManual()){
      this.save.setGroupeList();
      return;
    }
    // 断面力て入力モードの場合に適用する
    for (let i = this.input.member_list.length - 1; i >= 0; i--) {
      const columns = this.input.member_list[i];
      if ( this.isEnable(columns)){
        // グループNo の入力がない入力行には、仮のグループid をつける
        if( this.save.toNumber(columns.g_id) === null){
          columns.g_id = 'row' + columns.m_no; //仮のグループid
        }
      } else {
        this.input.member_list.splice(i, 1); // 有効な入力が何もない行は削除する
      }
    }
    this.save.setGroupeList();
  }

  private isEnable(columns: any) {
    const result: boolean = false;
    if(columns.g_name !== null){
      if(columns.g_name.trim().length > 0){
        return true;
      }
    }
    if(columns.shape !== null){
      if(columns.shape.trim().length > 0){
        return true;
      }
    }
    if(columns.B !== null){
      return true;
    }
    if(columns.H !== null){
      return true;
    }
    if(columns.Bt !== null){
      return true;
    }
    if(columns.t !== null){
      return true;
    }
    return false;
  }
  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = this.app.getWindowHeight();
    containerHeight -= 280;
    return containerHeight;
  }

  // 表高さに合わせた行数を計算する
  private rowsCount(): number {
    const containerHeight = this.tableHeight();
    return Math.round(containerHeight / 30);
  }

}
