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
  hottable_height: number;


  mambers_table_settings = {
    beforeChange: (...x: any[]) => {
      try {
        let changes: any = undefined;
        for (let i = 0; i < x.length; i++) {
          if (Array.isArray(x[i])) {
            changes = x[i];
            break;
          }
        }
        if (changes === undefined) { return; }
        for (let i = 0; i < changes.length; i++) {
          switch (changes[i][1]) {
            case 'vis_u':
            case 'vis_l':
              // 外観ひび割れの入力が変更された場合、何もしない
              break;
            case 'g_name':
              // 他の共通断面
              if (changes[i][3] === null) { continue; }         // 初期値は対象にしない
              for (let j = 0; j < this.mambers_table_datarows.length; j++) {
                const row = changes[i][0];
                if (row === j) { continue; }                     // 同じ行は比較しない
                const targetColumn = this.input.member_list[j];
                if (targetColumn.g_id.trim().length === 0) { continue; } // 初期値は対象にしない
                const changesColumn = this.input.member_list[row];
                if (targetColumn.g_id.toString() === changesColumn.g_id.toString()) {
                  targetColumn.g_name = changes[i][3].trim();
                }
              }
              break;

            case 'g_id':
              // 他の共通断面
              if (changes[i][3] === null) { continue; }         // 初期値は対象にしない
              for (let j = 0; j < this.mambers_table_datarows.length; j++) {
                const row = changes[i][0];
                if (row === j) { continue; }                      // 同じ行は比較しない
                const targetColumn = this.input.member_list[j];
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
              if (value1 !== null) {
                changes[i][3] = value1.toFixed(1);
              } else {
                changes[i][3] = null;
              }
              break;
            case 'r1_1':
            case 'r1_2':
            case 'r1_3':
              const value2: number = this.helper.toNumber(changes[i][3]);
              if (value2 !== null) {
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

  constructor(private input: InputMembersService,
    private helper: InputDataService) {
    /*
    nestedHeaders = [
      [ {label: '部材', rowspan: 2}, {label: '部材長', rowspan: 2}, {label: 'グループ', rowspan: 2},
        {label: '部材名', rowspan: 2}, {label: '断面', rowspan: 2}, {label: '断面(mm)', colspan: 4}, {label: '環境条件', colspan: 3}, {label: '外観', colspan: 2},
        'ひび割', 'せん断', {label: '曲げ加工 r1', colspan: 3}, {label: '部材', rowspan: 2}],
      ['番号', '', 'No', '', '形状', 'B', 'H', 'Bt', 't', '上側', '下側', 'せん断', '上側', '下側', 'εcsd', 'kr', '軸鉄筋', '帯筋', '折曲げ', '数']
    ];

          nestedHeaders: [
        [ {title: '部材長', rowspan: '2'}, {title: 'グループ', rowspan: '2'}, {title: '部材名', rowspan: '2'}, {title: '断面', rowspan: '2'}, 
          {title: '断面(mm)', colspan: '4'}, {title: '環境条件', colspan: '3'}, {title: '外観', colspan: '2'},
          'ひび割', 'せん断', {title: '曲げ加工 r1', colspan: 3}, {title: '部材', rowspan: 2}],
        [ '', 'No', '', '形状', 'B', 'H', 'Bt', 't', '上側', '下側', 'せん断', '上側', '下側', 'εcsd', 'kr', '軸鉄筋', '帯筋', '折曲げ', '数']
      ],
    */
  }

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
      
      onchangeheader: () => {

      },
      updateTable: (instance, cell, col, row, val, label, cellName) => {
        if (row % 2 !== 0) {
          cell.style.backgroundColor = '#f8f8ff'; // 偶数列の背景に淡い色をつける
        }
        if(col===0 || col===1){
          cell.style.backgroundColor = '#f3f3f3'; // 背景カラー
          cell.style.color = '#000';
        }
        /*/ Number formating
        if (col == 3) {
            // Get text
            txt = cell.innerText;
            // Format text
            txt = numeral(txt).format('0,0.00');
            // Update cell value
            cell.innerHTML = '$ ' + txt;
        }
 
        // Total row
        if (row == 9) {
            if (col < 3) {
                cell.innerHTML = '';
            } 
 
            if (col == 2) {
                cell.innerHTML = 'Total';
                cell.style.fontWeight = 'bold';
            }
 
            cell.className = '';
            cell.style.backgroundColor = '#f46e42';
            cell.style.color = '#ffffff';
        }
        */
      },
      /*
      onchange: changed,
      onbeforechange: beforeChange,
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
    })
  }

  public saveData(): void {

  }

}
