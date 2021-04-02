import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputMembersService } from './input-members.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import * as jexcel from 'jexcel';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})


export class MembersComponent implements OnInit {

  @ViewChild("spreadsheet") spreadsheet: ElementRef;

  mambers_table_datarows: any[];

  constructor(private input: InputMembersService,
    private helper: InputDataService) { }

  ngOnInit() {

    // テーブルの初期化
    this.mambers_table_datarows = new Array();
    for (let i = 0; i < this.input.member_list.length; i++) {
      const row = this.input.member_list[i];
      const column = this.input.getMemberTableColumns(row.m_no);
      this.mambers_table_datarows.push(column);
    }

  }

  ngAfterViewInit() {
    jexcel(this.spreadsheet.nativeElement, {
      data: this.mambers_table_datarows,
      nestedHeaders: [
        { title: '部材' }, { title: '部材長' }, { title: 'グループ' }, { title: '部材名' }, { title: '断面' },
        { title: '断面(mm)', colspan: '4' }, { title: '環境条件', colspan: '3' }, { title: '外観', colspan: '2' },
        { title: 'ひび割' }, { title: 'せん断' }, { title: '曲げ加工 r1', colspan: 3 }, { title: '部材' },
      ],
      colHeaders: ['番号', ' ', 'No', ' ', '形状',
        'B', 'H', 'Bt', 't', '上側', '下側', 'せん断', '上側', '下側', 
        'εcsd', 'kr', '軸鉄筋', '帯筋', '折曲げ', '数'],
      columns: [
        { type: 'numeric', width: 60, readOnly: true },
        { type: 'numeric', width: 85, readOnly: true },
        { type: 'numeric', width: 85 },
        { type: 'text', width: 110 },
        { type: 'text', width: 80 },

        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },

        { type: 'numeric', width: 60 },
        { type: 'numeric', width: 60 },
        { type: 'numeric', width: 60 },

        { type: 'checkbox', width: 50 },
        { type: 'checkbox', width: 50 },

        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 70 },
        { type: 'numeric', width: 80 },
      ],
      columnResize: false,
      onload: (instance, options) => {
        // ヘッダーの境界線を消す
        for(const c of [0,1,2,3,4,14,15,19]){
          options.headers[c].style['border-top'] = 'hidden';
        }
        options.hideIndex();
      },
      updateTable: (instance, cell, col, row, val, label, cellName) => {
        if (row % 2 !== 0) {
          cell.style.backgroundColor = '#f8f8ff'; // 偶数列の背景に淡い色をつける
        }
        if(col===0 || col===1){
          cell.style.backgroundColor = '#f3f3f3'; // 背景カラー
          cell.style.color = '#000';
        }
      },
      onbeforechange: (instance, cell, c, r, val) => {
        try {
          const row = this.helper.toNumber(r);
          const col = this.helper.toNumber(c);
          switch (col) {
          case 3:
            // 部材名
            if (val === null) { return; }         // 初期値は対象にしない
            for (let j = 0; j < this.mambers_table_datarows.length; j++) {
              if (row === j) { continue; }                     // 同じ行は比較しない
              const column = this.mambers_table_datarows[j];
              if (column[2].trim().length === 0) { continue; } // 初期値は対象にしない
              const changesColumn = this.mambers_table_datarows[row];
              if (column[2] === changesColumn[2].toString()) {
                column[col]= val.trim();
              }
            }
            instance.jexcel.refresh();
            break;

          case 2:
            // グループNo
            if (val === null) { return; }         // 初期値は対象にしない
            for (let j = 0; j < this.mambers_table_datarows.length; j++) {
              if (row === j) { continue; }                      // 同じ行は比較しない
              const column = this.mambers_table_datarows[j];
              const g_id = column[col].trim();
              if (g_id.length === 0) { continue; } // 初期値は対象にしない
              if (g_id === val.trim()) {
                this.mambers_table_datarows[row][3] = column[3].trim();
              }
            }
            instance.jexcel.refresh();
            break;
          case 4:
            // 番号を断面形状名に変換
            let value: string;
            switch (val.trim()) {
              case '1':
              case 'RC-矩形':
                value = 'RC-矩形';
                break;
              case '2':
              case 'RC-T形':
                value = 'RC-T形';
                break;
              case '3':
              case 'RC-円形':
                value = 'RC-円形';
                break;
              case '4':
              case 'RC-小判':
                value = 'RC-小判';
                break;
              case '11':
              case 'SRC-矩形':
                value = 'SRC-矩形';
                break;
              case '12':
              case 'SRC-T形':
                value = 'SRC-T形';
                break;
              case '13':
              case 'SRC-円形':
                value = 'SRC-円形';
                break;
              default:
                value = '';
            }
            this.mambers_table_datarows[row][col] = value;
            instance.jexcel.refresh();
            break;
          case 9:
          case 10:
          case 11:
            if(!(val===1||val===2||val===3)){
              this.mambers_table_datarows[row][col] = null;
              instance.jexcel.refresh();
            } 
            break;
          }
        } catch (e) {
          console.log(e);
        }
      },
      /*
      onchange: changed,
      oninsertrow: insertedRow,
      oninsertcolumn: insertedColumn,
      ondeleterow: deletedRow,
      ondeletecolumn: deletedColumn,
      onselection: selectionActive,
      onsort: sort,
      onresizerow: resizeRow,
      onresizecolumn: resizeColumn,
      onmoverow: moveRow,
      onmovecolumn: moveColumn,
      onload: loaded,
      onblur: blur,
      onfocus: focus,
      */
    });
  }

  public saveData(): void {

  }

}
