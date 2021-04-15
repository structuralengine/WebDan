import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import pq from 'pqgrid';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SaveDataService } from 'src/app/providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import { InputCrackSettingsService } from './crack-settings.service';

@Component({
  selector: 'app-crack-settings',
  templateUrl: './crack-settings.component.html',
  styleUrls: ['./crack-settings.component.scss']
})
export class CrackSettingsComponent implements OnInit {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[] = [
    { title: '部材\n番号', align: 'center', dataType: 'integer', dataIndx: 'm_no', editable: false, sortable: false, width: 60, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '位置', dataType: 'float', format: '#.000', dataIndx: 'position', editable: false, sortable: false, width: 110, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
    { title: '算出点名', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
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
    { title: 'ひび割<br/>εcsd', align: 'center', dataType: 'integer', dataIndx: 'ecsd', sortable: false, width: 70 },
    { title: 'せん断<br/>kr', dataType: 'float', format: '#.0', dataIndx: 'kr', sortable: false, width: 70 },
  ];

  public groupe_list: any[];
  private table_datas: any[][];

  constructor(
    private save: SaveDataService,
    public helper: DataHelperModule) { }

  ngOnInit() {

    this.groupe_list = this.save.crack.getCrackColumns();
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
        change: (evt, ui) => {
          for (const property of ui.updateList) {
            for (const key of Object.keys(property.newRow)) {
              const old = property.oldRow[key];
              if (key === 'con_u' || key === 'con_u' || key === 'con_u') {
                const value = this.helper.toNumber(property.newRow[key]);
                if (value === null) { continue; }         // 初期値は対象にしない
                const row = property.rowIndx;
                switch (value) {
                  case 1:
                  case 2:
                  case 3:
                    break;
                  default:
                    //this.mambers_table_datarows[row][key] = null;
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
    this.save.crack.setCrackColumns(this.table_datas);
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = window.innerHeight;
    containerHeight -= 230;
    return containerHeight;
  }
}
