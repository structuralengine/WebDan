import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { InputBarsService } from './bars.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss']
})
export class BarsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private beamHeaders: object[] = new Array();
  private columnHeaders: object[] = new Array();
  private pileHeaders: object[] = new Array();

  public groupe_list: any[];
  private table_datas: any[][];
  private mergeCells: any[][];
  private side_cover: string[];

  constructor(
    private app: AppComponent,
    private input: InputBarsService,
    private save: InputDataService) { }

  ngOnInit() {

    if (this.save.isManual()) {
      // 断面力手入力モードの場合
      this.beamHeaders = [
        { title: '部材<br/>番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '位置', dataType: 'float', format: '#.000', dataIndx: 'position', editable: false, sortable: false, width: 110, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '算出点名', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: '断面<br/>B<br/>H', align: 'center', dataType: 'float', dataIndx: 'bh', editable: false, sortable: false, width: 85, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: 'ハンチ高<br/>曲げ<br/>せん断', align: 'center', dataType: 'float', dataIndx: 'haunch_height', sortable: false, width: 85 },
        { title: '位置', align: 'center', dataType: 'string', dataIndx: 'design_point_id', editable: false, sortable: false, width: 40, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        {
          title: '軸方向鉄筋', align: 'center', colModel: [
            { title: '鉄筋径', dataType: 'integer', dataIndx: 'rebar_dia', sortable: false, width: 70 },
            { title: '本数', dataType: 'float', dataIndx: 'rebar_n', sortable: false, width: 70 },
            { title: 'かぶり1<br/>断目', dataType: 'float', dataIndx: 'rebar_cover', sortable: false, width: 70 },
            { title: 'ならび<br/>本数', dataType: 'float', dataIndx: 'rebar_lines', sortable: false, width: 70 },
            { title: 'アキ', dataType: 'float', dataIndx: 'rebar_space', sortable: false, width: 70 },
            { title: '間隔', dataType: 'float', dataIndx: 'rebar_ss', sortable: false, width: 70 }
          ]
        },
        {
          title: '側方鉄筋', align: 'center', colModel: [
            { title: '鉄筋径', dataType: 'integer', dataIndx: 'side_dia', sortable: false, width: 70 },
            { title: '本数片', dataType: 'float', dataIndx: 'side_n', sortable: false, width: 70 },
            { title: '右端位置', dataType: 'float', dataIndx: 'side_cover', sortable: false, width: 70 },
            { title: '間隔', dataType: 'float', dataIndx: 'side_ss', sortable: false, width: 70 }
          ]
        },
        {
          title: 'せん断補強鉄筋', align: 'center', colModel: [
            { title: '鉄筋径', dataType: 'integer', dataIndx: 'stirrup_dia', sortable: false, width: 70 },
            { title: '本数', dataType: 'float', dataIndx: 'stirrup_n', sortable: false, width: 70 },
            { title: '間隔', dataType: 'float', dataIndx: 'stirrup_ss', sortable: false, width: 70 }
          ]
        },
        { title: '主鉄筋の斜率', dataType: 'float', dataIndx: 'cos', sortable: false, width: 85 },
        { title: 'tanγ+tanβ', dataType: 'float', dataIndx: 'tan', sortable: false, width: 85 },
        { title: '処理', align: 'center', dataType: 'bool', dataIndx: 'enable', type: 'checkbox', sortable: false, width: 40 },
      ];
    } else {
      
    }


    this.groupe_list = this.input.getBarsColumns();
    this.table_datas = new Array(this.groupe_list.length);
    this.mergeCells = new Array(this.groupe_list.length);
    this.side_cover = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      this.mergeCells[i] = new Array();

      const groupe = this.groupe_list[i];

      if (groupe.length > 0) {
        // グループタイプ によって 上側・下側の表示を 右側・左側 等にする
        let upperSideName: string = '上';
        let bottomSideName: string = '下';
        this.side_cover[i] = '上端位置';
        if (groupe[0].g_id.toUpperCase().indexOf('R') >= 0) {
          upperSideName = '外';
          bottomSideName = '内';
          this.side_cover[i] = '外端位置';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('L') >= 0) {
          upperSideName = '内';
          bottomSideName = '外';
          this.side_cover[i] = '内端位置';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('P') >= 0) {
          upperSideName = '右';
          bottomSideName = '左';
          this.side_cover[i] = '右端位置';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('C') >= 0) {
          upperSideName = '右';
          bottomSideName = '左';
          this.side_cover[i] = '右端位置';
        }

        let row: number = 0;
        for (let j = 0; j < groupe.length; j++) {
          const member = groupe[j];

          const positionCount: number = member['positions'].length;
          this.mergeCells[i].push({ row: row, col: 0, rowspan: positionCount * 2, colspan: 1 });

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
            const a: number = this.save.toNumber(data['position']);
            column1['position'] = (a === null) ? '' : a.toFixed(3);
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
            for (let col = 1; col <= 2; col++) {
              this.mergeCells[i].push({ row: row, col: col, rowspan: 2, colspan: 1 });
            }
            for (let col = 12; col <= 18; col++) {
              this.mergeCells[i].push({ row: row, col: col, rowspan: 2, colspan: 1 });
            }
            row += 2;
          }
        }
      }

      // グリッドの設定
      this.options.push({
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        height: this.tableHeight().toString(),
        numberCell: { show: false }, // 行番号
        colModel: this.BeamHeaders,
        dataModel: { data: this.table_datas[i] },
        change: (evt, ui) => {
          for (const property of ui.updateList) {
            for (const key of Object.keys(property.newRow)) {
              const old = property.oldRow[key];
              if (key === 'rebar_dia' || key === 'side_dia' || key === 'stirrup_dia') {
                // 鉄筋径の規格以外は入力させない
                const value0 = this.input.matchBarSize(property.newRow[key]);
                const j = property.rowIndx;
                if( value0 === null ) {
                  this.table_datas[i][j][key] = old;
                }
              }
            }
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    this.grids.forEach((grid, i, array) => {
      grid.options = this.options[i];
      grid.refreshDataAndView();
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }
  public saveData(): void {
    this.input.setBarsColumns(this.table_datas);
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = this.app.getWindowHeight();
    containerHeight -= 230;
    return containerHeight;
  }

  public getGroupeName(i: number): string {
    const target = this.groupe_list[i];
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
