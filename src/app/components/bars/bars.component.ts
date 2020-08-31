import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { InputBarsService } from './input-bars.service';
import { InputDataService } from 'src/app/providers/input-data.service';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss']
})
export class BarsComponent implements OnInit, OnDestroy {
  
  @ViewChild('ht_container', { static: true }) ht_container: ElementRef;
  hottable_height: number;

  groupe_list: any[];
  table_datas: any[][];
  mergeCells: any[][];
  side_cover: string[];

  table_settings = {
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
            case 'rebar_dia':
            case 'side_dia':
            case 'stirrup_dia':
              // 鉄筋径の規格以外は入力させない
              const value0: number = this.input.matchBarSize(changes[i][3]);
              if( value0 !== null ) {
                changes[i][3] = value0;
              }else{
                changes[i][3] = '';
              }
              break;
            case 'cos':
              const value1: number = this.helper.toNumber(changes[i][3]);
              if( value1 !== null ) {
                changes[i][3] = value1.toFixed(3);
              } else {
                changes[i][3] = null;
              }
              break;
            case 'tan':
              const value2: number = this.helper.toNumber(changes[i][3]);
              if( value2 !== null ) {
                changes[i][3] = value2.toFixed(3);
              } else {
                changes[i][3] = null;
              }
              break;
            default:
              const value: number = this.helper.toNumber(changes[i][3]);
              if( value !== null ) {
                changes[i][3] = value;
              } else {
                changes[i][3] = null;
              }
              break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  };

  constructor(private input: InputBarsService,
              private helper: InputDataService) {

  }

  ngOnInit() {

    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 250;

    this.groupe_list = this.input.getBarsColumns();
    this.table_datas = new Array(this.groupe_list.length);
    this.mergeCells = new Array(this.groupe_list.length);
    this.side_cover = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      this.mergeCells[i] = new Array();

      const groupe = this.groupe_list[i];

      // グループタイプ によって 上側・下側の表示を 右側・左側 等にする
      let upperSideName: string = '上';
      let bottomSideName: string = '下';
      this.side_cover[i] = "上端位置";
      if (groupe[0].g_id.toUpperCase().indexOf('R') >= 0) {
        upperSideName = '外';
        bottomSideName = '内';
        this.side_cover[i] = "外端位置";
      }
      if (groupe[0].g_id.toUpperCase().indexOf('L') >= 0) {
        upperSideName = '内';
        bottomSideName = '外';
        this.side_cover[i] = "内端位置";
      }
      if (groupe[0].g_id.toUpperCase().indexOf('P') >= 0) {
        upperSideName = '右';
        bottomSideName = '左';
        this.side_cover[i] = "右端位置";
      }
      if (groupe[0].g_id.toUpperCase().indexOf('C') >= 0) {
        upperSideName = '右';
        bottomSideName = '左';
        this.side_cover[i] = "右端位置";
      }

      let row: number = 0;
      for (let j = 0; j < groupe.length; j++) {
        const member = groupe[j];

        const positionCount: number = member['positions'].length;
        this.mergeCells[i].push({row: row, col: 0, rowspan: positionCount * 2, colspan: 1});

        for (let k = 0; k < positionCount; k++) {
          const data = member['positions'][k];
          const column1 = {};
          const column2 = {};
          if (k === 0) {
            // 最初の行には 部材番号を表示する
            column1['m_no'] = data['m_no'];
          }
          // 1行目
          column1['index'] = data['index'];
          const a: number = this.helper.toNumber(data['position']);
          column1['position'] = (a===null) ? '' : a.toFixed(3);
          column1['p_name'] = data['p_name'];
          column1['p_name_ex'] = data['p_name_ex'];
          column1['bh'] = data['b'];
          column1['haunch_height'] = data['haunch_M'];

          column1['design_point_id'] = upperSideName;// data['rebar1'].title;
          column1['rebar_dia'] = data['rebar1'].rebar_dia;
          column1['rebar_n'] = data['rebar1'].rebar_n;
          column1['rebar_cover'] = data['rebar1'].rebar_cover;
          column1['rebar_lines'] = data['rebar1'].rebar_lines;
          column1['rebar_space'] = data['rebar1'].rebar_space;
          column1['rebar_ss'] = data['rebar1'].rebar_ss;
          column1['cos'] = data['rebar1'].cos;
          column1['enable'] = data['rebar1'].enable;

          column1['side_dia'] = data['sidebar'].side_dia;
          column1['side_n'] = data['sidebar'].side_n;
          column1['side_cover'] = data['sidebar'].side_cover;
          column1['side_ss'] = data['sidebar'].side_ss;

          column1['stirrup_dia'] = data['starrup'].stirrup_dia;
          column1['stirrup_n'] = data['starrup'].stirrup_n;
          column1['stirrup_ss'] = data['starrup'].stirrup_ss;

          column1['tan'] = data['tan']; 
          this.table_datas[i].push(column1);

          // 2行目
          column2['bh'] = data['h'];
          column2['haunch_height'] = data['haunch_V'];

          column2['design_point_id'] = bottomSideName;// data['rebar2'].title;
          column2['rebar_dia'] = data['rebar2'].rebar_dia;
          column2['rebar_n'] = data['rebar2'].rebar_n;
          column2['rebar_cover'] = data['rebar2'].rebar_cover;
          column2['rebar_lines'] = data['rebar2'].rebar_lines;
          column2['rebar_space'] = data['rebar2'].rebar_space;
          column2['rebar_ss'] = data['rebar2'].rebar_ss;
          column2['stirrup_dia'] = data['bend'].bending_dia;
          column2['stirrup_n'] = data['bend'].bending_n;
          column2['stirrup_ss'] = data['bend'].bending_ss; 
          column2['cos'] = data['rebar2'].cos;
          column2['enable'] = data['rebar2'].enable;

          this.table_datas[i].push(column2);

          // セルの結合情報
          for(let col= 1; col <= 2; col++) {
            this.mergeCells[i].push({row: row, col: col, rowspan: 2, colspan: 1});
          }
          for(let col= 12; col <= 18; col++) {
            this.mergeCells[i].push({row: row, col: col, rowspan: 2, colspan: 1});
          }
          row += 2;
        }
      }
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }
  public saveData(): void {
    this.input.setBarsColumns(this.table_datas);
  }

}
