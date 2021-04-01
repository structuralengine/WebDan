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
      const column1 = this.input.getMemberTableColumns(row.m_no);
      const column: any[] = new Array();
      for(let col = 1; col < column1.length; col++){
        column.push(column1[col]);
      }
      this.mambers_table_datarows.push(column);
    }

  }
  
  ngAfterViewInit() {
    jexcel(this.spreadsheet.nativeElement, {
      data: this.mambers_table_datarows,
      columns: [
        { type: 'numeric', width: 85 },   // m_len
        { type: 'numeric', width: 85 },   // g_id
        { type: 'numeric', width: 110 },  // g_name
        { type: 'numeric', width: 80 },   // shape

        { type: 'numeric', width: 70 },   // B
        { type: 'numeric', width: 70 },   // H
        { type: 'numeric', width: 70 },   // Bt
        { type: 'numeric', width: 70 },   // t
        
        { type: 'numeric', width: 60 },   // con_u
        { type: 'numeric', width: 60 },   // con_l
        { type: 'numeric', width: 60 },   // con_s
        
        { type: 'checkbox', width: 50 },   // vis_u
        { type: 'checkbox', width: 50 },   // vis_l
        
        { type: 'numeric', width: 70 },   // ecsd
        { type: 'numeric', width: 70 },   // kr
        { type: 'numeric', width: 70 },   // r1_1
        { type: 'numeric', width: 70 },   // r1_2
        { type: 'numeric', width: 70 },   // r1_3
        { type: 'numeric', width: 80 },   // n
      ],
      nestedHeaders: [
        [ {title: '部材長', rowspan: '2'}, {title: 'グループ', rowspan: '2'}, {title: '部材名', rowspan: '2'}, {title: '断面', rowspan: '2'}, 
          {title: '断面(mm)', colspan: '4'}, {title: '環境条件', colspan: '3'}, {title: '外観', colspan: '2'},
          {title: 'ひび割'}, {title: 'せん断'}, {title: '曲げ加工 r1', colspan: 3}, {title: '部材', rowspan: 2}],

        [ {title: ''}, {title: 'No'}, {title: ''}, {title: '形状'}, 
          {title: 'B'}, {title: 'H'}, {title: 'Bt'}, {title: 't'}, {title: '上側'}, {title: '下側'}, 
          {title: 'せん断'}, {title: '上側'}, {title: '下側'}, {title: 'εcsd'}, {title: 'kr'}, 
          {title: '軸鉄筋'}, {title: '帯筋'}, {title: '折曲げ'}, {title: '数'}]
      ],
      minDimensions: [2, 20]
    });
  }


  public saveData(): void {

  }

}
