import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { InputFatiguesService } from './fatigues.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-fatigues',
  templateUrl: './fatigues.component.html',
  styleUrls: ['./fatigues.component.scss']
})
export class FatiguesComponent implements OnInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[] = [
    { title: '部材\n番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '位置', dataType: 'float', format: '#.000', dataIndx: 'position', editable: false, sortable: false, width: 110, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '算出点名', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '断面\nB\nH', align: 'center', dataType: 'float', dataIndx: 'bh', editable: false, sortable: false, width: 85, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
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
    },
  ];

  public groupe_list: any[];
  private table_datas: any[][];

  public train_A_count: number;
  public train_B_count: number;
  public service_life: number;

  constructor(
    private app: AppComponent,
    private input: InputFatiguesService,
    private helper: InputDataService) { }

  ngOnInit() {

    this.groupe_list = this.input.getFatiguesColumns();
    this.table_datas = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      const groupe = this.groupe_list[i];
      if (groupe.length > 0) {
        // グループタイプ によって 上側・下側の表示を 右側・左側 等にする
        let upperSideName: string = '上';
        let bottomSideName: string = '下';
        if (groupe[0].g_id.toUpperCase().indexOf('R') >= 0) {
          upperSideName = '外';
          bottomSideName = '内';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('L') >= 0) {
          upperSideName = '内';
          bottomSideName = '外';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('P') >= 0) {
          upperSideName = '右';
          bottomSideName = '左';
        }
        if (groupe[0].g_id.toUpperCase().indexOf('C') >= 0) {
          upperSideName = '右';
          bottomSideName = '左';
        }

        for (let j = 0; j < groupe.length; j++) {
          const member = groupe[j];
          for (let k = 0; k < member['positions'].length; k++) {
            const data = member['positions'][k];
            const column1 = {};
            const column2 = {};
            if (k === 0) {
              // 最初の行には 部材番号を表示する
              column1['m_no'] = data['m_no'];
            }
            // 1行目
            column1['index'] = data['index'];
            column1['position'] = data['position'];
            column1['p_name'] = data['p_name'];
            column1['p_name_ex'] = data['p_name_ex'];


            column1['bh'] = data['b'];
            column1['design_point_id'] = upperSideName; // data['title1'];

            column1['M_SA'] = data['M1'].SA;
            column1['M_SB'] = data['M1'].SB;
            column1['M_NA06'] = data['M1'].NA06;
            column1['M_NB06'] = data['M1'].NB06;
            column1['M_NA12'] = data['M1'].NA12;
            column1['M_NB12'] = data['M1'].NB12;
            column1['M_A'] = data['M1'].A;
            column1['M_B'] = data['M1'].B;

            column1['V_SA'] = data['V1'].SA;
            column1['V_SB'] = data['V1'].SB;
            column1['V_NA06'] = data['V1'].NA06;
            column1['V_NB06'] = data['V1'].NB06;
            column1['V_NA12'] = data['V1'].NA12;
            column1['V_NB12'] = data['V1'].NB12;
            column1['V_A'] = data['V1'].A;
            column1['V_B'] = data['V1'].B;

            this.table_datas[i].push(column1);

            // 2行目
            column2['bh'] = data['h'];
            column2['design_point_id'] = bottomSideName; // data['title2'];

            column2['M_SA'] = data['M2'].SA;
            column2['M_SB'] = data['M2'].SB;
            column2['M_NA06'] = data['M2'].NA06;
            column2['M_NB06'] = data['M2'].NB06;
            column2['M_NA12'] = data['M2'].NA12;
            column2['M_NB12'] = data['M2'].NB12;
            column2['M_A'] = data['M2'].A;
            column2['M_B'] = data['M2'].B;

            column2['V_SA'] = data['V2'].SA;
            column2['V_SB'] = data['V2'].SB;
            column2['V_NA06'] = data['V2'].NA06;
            column2['V_NB06'] = data['V2'].NB06;
            column2['V_NA12'] = data['V2'].NA12;
            column2['V_NB12'] = data['V2'].NB12;
            column2['V_A'] = data['V2'].A;
            column2['V_B'] = data['V2'].B;

            this.table_datas[i].push(column2);
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
        colModel: this.columnHeaders,
        dataModel: { data: this.table_datas[i] },
      });
    }
    this.train_A_count = this.input.train_A_count;
    this.train_B_count = this.input.train_B_count;
    this.service_life = this.input.service_life;
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
    this.input.setFatiguesColumns(this.table_datas);
    this.input.train_A_count = this.train_A_count;
    this.input.train_B_count = this.train_B_count;
    this.input.service_life = this.service_life;
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = this.app.getWindowHeight();
    containerHeight -= 230;
    return containerHeight;
  }
}
