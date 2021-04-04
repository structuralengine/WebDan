import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputMembersService } from './members.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import { AppComponent } from 'src/app/app.component';
import pq from "pqgrid";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})


export class MembersComponent implements OnInit {

  @ViewChild('grid') grid: SheetComponent;

  private mambers_table_datarows: any[] = [];

  private columnHeaders: object[] = [
    { title: "部材\n番号", align: "center", dataType: "integer", dataIndx: "m_no", editable: false, sortable: false, width: 60, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' } },
    { title: "部材長", dataType: "float", format: "#.000", dataIndx: "m_len", editable: false, sortable: false, width: 90, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' } },
    { title: "グループNo", align: "center", dataType: "integer", dataIndx: "g_id", sortable: false, width: 85 },
    { title: "部材名", align: "center", dataType: "string", dataIndx: "g_name", sortable: false, width: 110 },
    { title: "断面形状", dataType: "string", dataIndx: "shape", sortable: false, width: 80 },
    {
      title: "断面(mm)", align: "center", colModel: [
        { title: "B", width: 70 },
        { title: "H", width: 70 },
        { title: "Bt", width: 70 },
        { title: "t", width: 70 }
      ]
    },
    {
      title: "環境条件", align: "center", colModel: [
        { title: "上側", dataType: "integer", dataIndx: "con_u", sortable: false, width: 60 },
        { title: "下側", dataType: "integer", dataIndx: "con_l", sortable: false, width: 60 },
        { title: "せん断", dataType: "integer", dataIndx: "con_s", sortable: false, width: 60 }
      ]
    },
    {
      title: "外観", align: "center", colModel: [
        { title: "上側", align: "center", dataType: "bool", dataIndx: "vis_u", type: 'checkbox', sortable: false, width: 50 },
        { title: "下側", align: "center", dataType: "bool", dataIndx: "vis_l", type: 'checkbox', sortable: false, width: 50 }
      ]
    },
    { title: "ひび割\nεcsd", align: "center", dataType: "integer", dataIndx: "ecsd", sortable: false, width: 70 },
    { title: "せん断\nkr", dataType: "float", format: "#.0", dataIndx: "kr", sortable: false, width: 70 },
    {
      title: "曲げ加工 r1", align: "center", colModel: [
        { title: "軸鉄筋", dataType: "float", format: "#.00", dataIndx: "r1_1", sortable: false, width: 60 },
        { title: "帯筋", dataType: "float", format: "#.00", dataIndx: "r1_2", sortable: false, width: 60 },
        { title: "折曲げ", dataType: "float", format: "#.00", dataIndx: "r1_3", sortable: false, width: 60 }
      ]
    },
    { title: "部材数", align: "center", dataType: "float", dataIndx: "n", sortable: false, width: 80 },
  ];

  private ROWS_COUNT = 0;

  /*
  mambers_table_settings = {
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
          switch (changes[i][1]) {
            case 'vis_u':
            case 'vis_l':
              // 外観ひび割れの入力が変更された場合、何もしない
              break;
            case 'g_name':
              // 他の共通断面
              if ( changes[i][3] === null) { continue; }         // 初期値は対象にしない
              for ( let j = 0; j < this.mambers_table_datarows.length; j++) {
                const row = changes[i][0];
                if (row === j) { continue; }                     // 同じ行は比較しない
                const targetColumn  = this.input.member_list[j];
                if (targetColumn.g_id.trim().length === 0) { continue; } // 初期値は対象にしない
                const changesColumn = this.input.member_list[row];
                if (targetColumn.g_id.toString() === changesColumn.g_id.toString()) {
                  targetColumn.g_name = changes[i][3].trim();
                }
              }
              break;

            case 'g_id':
              // 他の共通断面
              if ( changes[i][3] === null) { continue; }         // 初期値は対象にしない
              for ( let j = 0; j < this.mambers_table_datarows.length; j++) {
                const row = changes[i][0];
                if (row === j) { continue; }                      // 同じ行は比較しない
                const targetColumn  = this.input.member_list[j];
                if (targetColumn.g_id.trim().length === 0) { continue; } // 初期値は対象にしない
                if (targetColumn.g_id.toString() === changes[i][3].trim().toString()) {
                  this.input.member_list[row].g_name = targetColumn.g_name.trim();
                }
              }
              break;
            case 'shape':
              // 番号を断面形状名に変換
              switch (changes[i][3].trim()) {
                case '1':
                case 'RC-矩形':
                  changes[i][3] = 'RC-矩形';
                  break;
                case '2':
                case 'RC-T形':
                  changes[i][3] = 'RC-T形';
                  break;
                case '3':
                case 'RC-円形':
                  changes[i][3] = 'RC-円形';
                  break;
                case '4':
                case 'RC-小判':
                  changes[i][3] = 'RC-小判';
                  break;
                case '11':
                case 'SRC-矩形':
                  changes[i][3] = 'SRC-矩形';
                  break;
                case '12':
                case 'SRC-T形':
                  changes[i][3] = 'SRC-T形';
                  break;
                case '13':
                case 'SRC-円形':
                  changes[i][3] = 'SRC-円形';
                  break;
                default:
                  changes[i][3] = '';
              }
              break;
            case 'con_u':
            case 'con_l':
            case 'con_s':
              switch (changes[i][3]) {
                case 1:
                case 2:
                case 3:
                  break;
                default:
                  changes[i][3] = '';
              }
              break;
            case 'kr':
              const value1: number = this.helper.toNumber(changes[i][3]);
              if( value1 !== null ) {
                changes[i][3] = value1.toFixed(1);
              } else {
                changes[i][3] = null;
              }
              break;
            case 'r1_1':
            case 'r1_2':
            case 'r1_3':
              const value2: number = this.helper.toNumber(changes[i][3]);
              if( value2 !== null ) {
                changes[i][3] = value2.toFixed(2);
              } else {
                changes[i][3] = null;
              }
              break;
            case 'B':
            case 'H':
            case 'Bt':
            case 't':
            case 'ecsd':
            case 'n':
            // 数字チェック
            const value: number = this.helper.toNumber(changes[i][3]);
            if (value === null) {
              changes[i][3] = null;
            }
            break;
        }
      }
      } catch (e) {
        console.log(e);
      }

    },
    afterChange: (hotInstance, changes, source) => {
    },
  };
  */

  constructor(private input: InputMembersService,
    private app: AppComponent,
    private helper: InputDataService) {
  }

  ngOnInit() {
    this.ROWS_COUNT = this.rowsCount();
  }

  // 指定行row 以降のデータを読み取る
  private loadData(row: number): void {
    for (let i = this.mambers_table_datarows.length + 1; i <= row; i++) {
      const node = this.input.getMemberTableColumns(i);
      this.mambers_table_datarows.push(node);
    }
  }

  public saveData(): void {

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

  // グリッドの設定
  options: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    height: this.tableHeight().toString(),
    numberCell: { show: false }, // 行番号
    colModel: this.columnHeaders,
    dataModel: { data: this.mambers_table_datarows },
    beforeTableView: (evt, ui) => { // 無限ループ
      const finalV = ui.finalV;
      const dataV = this.mambers_table_datarows.length;
      if (ui.initV == null) {
        return;
      }
      if (finalV >= dataV - 1) {
        this.loadData(dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectChange: (evt, ui) => {
      for (const range of ui.selection.iCells.ranges){
        if(range.c2 < 2){ 
          // 左の2行は全行選択にしたい
        }
      }
    },
    change: (evt, ui) => {
      
    }
  };

}
