import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { InputFatiguesService } from './input-fatigues.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-fatigues',
  templateUrl: './fatigues.component.html',
  styleUrls: ['./fatigues.component.scss']
})
export class FatiguesComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: SheetComponent;

  private columnHeaders: object[] = [
    { title: "部材\n番号", align: "left", dataType: "string", dataIndx: "m_no", editable: false, sortable: false, width: 60, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' } },
    { title: "位置", dataType: "float", dataIndx: "position", editable: false, sortable: false, width: 110, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' } },
    { title: "算出点名", dataType: "integer", dataIndx: "p_name_ex", editable: false, sortable: false, width: 250, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' }  },
    {
      title: "断面", align: "center", dataIndx: "bh", colModel: [
        { title: "B", width: 85 },
        { title: "H", width: 85 }
      ]
    },
    { title: "位置", dataType: "integer", dataIndx: "design_point_id", sortable: false, width: 40 },
    {
      title: "曲げ用", align: "center", colModel: [
        { title: "SA/SC", dataType: "integer", dataIndx: "M_SA", sortable: false, width: 70 },
        { title: "SB/SC", dataType: "integer", dataIndx: "M_SB", sortable: false, width: 70 },
        { title: "k=0.06", dataType: "integer", width: 70 , colModel: [
          { title: "NA", dataType: "integer", dataIndx: "M_NA06", sortable: false, width: 70 },
          { title: "NB", dataType: "integer", dataIndx: "M_NB06", sortable: false, width: 70 }
        ]},
        { title: "k=0.12", dataType: "integer", width: 70 , colModel: [
          { title: "NA", dataType: "integer", dataIndx: "M_NA12", sortable: false, width: 70 },
          { title: "NB", dataType: "integer", dataIndx: "M_NB12", sortable: false, width: 70 }
        ]},
        { title: "複線補正r2", dataType: "integer", width: 70 , colModel: [
          { title: "α", dataType: "integer", dataIndx: "M_A", sortable: false, width: 70 },
          { title: "β", dataType: "integer", dataIndx: "M_B", sortable: false, width: 70 }
        ]},
      ]
    },
    {
      title: "せん断用", align: "center", colModel: [
        { title: "SA/SC", align: "center", dataType: "bool", dataIndx: "V_SA",  sortable: false, width: 50 },
        { title: "SB/SC", align: "center", dataType: "bool", dataIndx: "V_SB",  sortable: false, width: 50 },
        { title: "k=0.06", dataType: "integer", width: 70 , colModel: [
          { title: "NA", dataType: "integer", dataIndx: "V_NA06", sortable: false, width: 70 },
          { title: "NB", dataType: "integer", dataIndx: "V_NB06", sortable: false, width: 70 }
        ]},
        { title: "k=0.12", dataType: "integer", width: 70 , colModel: [
          { title: "NA", dataType: "integer", dataIndx: "V_NA12", sortable: false, width: 70 },
          { title: "NB", dataType: "integer", dataIndx: "V_NB12", sortable: false, width: 70 }
        ]},
        { title: "複線補正r2", dataType: "integer", width: 70 , colModel: [
          { title: "α", dataType: "integer", dataIndx: "V_A", sortable: false, width: 70 },
          { title: "β", dataType: "integer", dataIndx: "V_B", sortable: false, width: 70 }
        ]},
      ]
    },
  ];

  @ViewChild('ht_container', { static: true }) ht_container: ElementRef;
  hottable_height: number;

  groupe_list: any[];
  table_datas: any[][];

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
            case 'M_SA':
            case 'M_SB':
            case 'M_A':
            case 'M_B':
            case 'V_SA':
            case 'V_SB':
            case 'V_A':
            case 'V_B':
              const value1: number = this.helper.toNumber(changes[i][3]);
              if( value1 !== null ) {
                changes[i][3] = value1.toFixed(3);
              } else {
                changes[i][3] = null;
              }
              break;
            default:
              const value2: number = this.helper.toNumber(changes[i][3]);
              if( value2 !== null ) {
                changes[i][3] = value2.toFixed(2);
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

  train_A_count: number;
  train_B_count: number;
  service_life: number;
  reference_count: number;

  constructor(
    private input: InputFatiguesService,
    private helper: InputDataService) {

  }

  ngOnInit() {
    
    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 280;

    this.groupe_list = this.input.getFatiguesColumns();
    this.table_datas = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      const groupe = this.groupe_list[i];

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

    this.train_A_count = this.input.train_A_count;
    this.train_B_count = this.input.train_B_count;
    this.service_life = this.input.service_life;
    this.reference_count = this.input.reference_count;
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

    // グリッドの設定
    options: pq.gridT.options = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: "jp",
      numberCell: { show: false }, // 行番号
      colModel: this.columnHeaders,
      dataModel: { data: [] },
    };

}
