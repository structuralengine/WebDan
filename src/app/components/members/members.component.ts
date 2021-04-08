import { Component, OnInit, ViewChild } from '@angular/core';
import { InputMembersService } from './members.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import { AppComponent } from 'src/app/app.component';
import pq from 'pqgrid';
import { SaveDataService } from 'src/app/providers/save-data.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})


export class MembersComponent implements OnInit {

  @ViewChild('grid') grid: SheetComponent;
  public options: pq.gridT.options;
  private columnHeaders: object[] = [
    { title: '部材\n番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '部材長', dataType: 'float', format: '#.000', dataIndx: 'm_len', editable: false, sortable: false, width: 90, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: 'グループNo', align: 'center', dataType: 'string', dataIndx: 'g_id', sortable: false, width: 85 },
    { title: '部材名', align: 'center', dataType: 'string', dataIndx: 'g_name', sortable: false, width: 110 },
    { title: '断面形状', dataType: 'string', dataIndx: 'shape', sortable: false, width: 80 },
    {
      title: '断面(mm)', align: 'center', colModel: [
        { title: 'B', width: 70 },
        { title: 'H', width: 70 },
        { title: 'Bt', width: 70 },
        { title: 't', width: 70 }
      ]
    },
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
    { title: 'ひび割\nεcsd', align: 'center', dataType: 'integer', dataIndx: 'ecsd', sortable: false, width: 70 },
    { title: 'せん断\nkr', dataType: 'float', format: '#.0', dataIndx: 'kr', sortable: false, width: 70 },
    {
      title: '曲げ加工 r1', align: 'center', colModel: [
        { title: '軸鉄筋', dataType: 'float', format: '#.00', dataIndx: 'r1_1', sortable: false, width: 60 },
        { title: '帯筋', dataType: 'float', format: '#.00', dataIndx: 'r1_2', sortable: false, width: 60 },
        { title: '折曲げ', dataType: 'float', format: '#.00', dataIndx: 'r1_3', sortable: false, width: 60 }
      ]
    },
    { title: '部材数', align: 'center', dataType: 'float', dataIndx: 'n', sortable: false, width: 80 },
  ];

  private ROWS_COUNT = 0;
  private mambers_table_datarows: any[] = [];

  constructor(
    private app: AppComponent,
    private save: SaveDataService,
    private input: InputMembersService,
    private helper: InputDataService) {
  }

  ngOnInit() {
    
    // グリッドの基本的な オプションを登録する
    this.options = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      height: this.tableHeight().toString(),
      width: 'auto',
      numberCell: { show: false }, // 行番号
      colModel: this.columnHeaders,
      change: (evt, ui) => {
        for (const property of ui.updateList) {
          for (const key of Object.keys(property.newRow)) {
            const old = property.oldRow[key];
            if (key === 'g_id') {
              // 他の共通断面
              const value = this.helper.getGroupeNo(property.newRow[key]);
              if (value === null) { continue; }         // 初期値は対象にしない
              for (let j = 0; j < this.mambers_table_datarows.length; j++) {
                if (property.rowIndx === j) { continue; }                      // 同じ行は比較しない
                const targetColumn = this.mambers_table_datarows[j];
                const target = this.helper.getGroupeNo(targetColumn.g_id);
                if (target === null) { continue; } // 初期値は対象にしない
                if (target === value) {
                  const i = property.rowIndx;
                  this.mambers_table_datarows[i].g_name = targetColumn.g_name;
                }
              }
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
                const target = this.helper.getGroupeNo(targetColumn.g_id);
                if (this.helper.getGroupeNo(target) === null) { continue; } // 初期値は対象にしない
                const row = property.rowIndx;
                const changesColumn = this.mambers_table_datarows[row];
                const current = this.helper.getGroupeNo(changesColumn.g_id);
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
            } else if (key === 'con_u' || key === 'con_u' || key === 'con_u') {
              const value = this.helper.toNumber(property.newRow[key]);
              if (value === null) { continue; }         // 初期値は対象にしない
              const row = property.rowIndx;
              switch (value) {
                case 1:
                case 2:
                case 3:
                  break;
                default:
                  this.mambers_table_datarows[row][key] = null;
              }
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
        const finalV = ui.finalV;
        const dataV = this.mambers_table_datarows.length;
        if (ui.initV == null) {
          return;
        }
        if (finalV >= dataV - 1) {
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

  public saveData(): void {
    // データは 記憶領域と直接結合しているため終了時にセーブする必要ない
    // ただし、表示画面の saveData() を呼ぶ関数が parent に存在しているため
    // この関数の定義だけは必要
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = this.app.getWindowHeight();
    containerHeight -= 360;
    return containerHeight;
  }

  // 表高さに合わせた行数を計算する
  private rowsCount(): number {
    const containerHeight = this.tableHeight();
    return Math.round(containerHeight / 30);
  }

}
