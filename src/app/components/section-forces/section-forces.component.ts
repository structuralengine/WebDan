import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SaveDataService } from 'src/app/providers/save-data.service';
import { InputSectionForcesService } from './section-forces.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-section-forces',
  templateUrl: './section-forces.component.html',
  styleUrls: ['./section-forces.component.scss']
})
export class SectionForcesComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private force: InputSectionForcesService) { }

  // 曲げモーメントのグリッド設定変数
  @ViewChild('grid1') grid1: SheetComponent;
  private columnHeaders1: object[] = [
    { title: '部材名', align: 'center', dataType: 'string', dataIndx: 'g_name', sortable: false, width: 110 },
    { title: '算出点名', align: 'left', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' }  },
    { title: '耐久性・使用性', align: 'center', colModel: [
      { title: '縁応力検討用', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)',  dataType: 'float', 'format': '#.00', dataIndx: 'case0_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',    dataType: 'float', 'format': '#.00', dataIndx: 'case0_Nd', sortable: false, width: 70 }
      ]},
      { title: '耐久性検討用<br/>(永久作用)', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case1_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case1_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '疲労', align: 'center', colModel: [
      { title: '最小応力', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case2_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case2_Nd', sortable: false, width: 70 }
      ]},
      { title: '最大応力', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case3_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case3_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '破壊', align: 'center', colModel: [
      { title: '曲げ耐力検討用', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case4_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case4_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '復旧性', align: 'center', colModel: [
      { title: '地震時以外', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case5_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case5_Nd', sortable: false, width: 70 }
      ]},
      { title: '地震時', align: 'center', colModel: [
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case6_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case6_Nd', sortable: false, width: 70 }
      ]},
    ]}
  ];
  private ROWS_COUNT1 = 0;
  private table_datas1: any[] = [];
  public options1: pq.gridT.options;

  // せん断力のグリッド設定変数
  @ViewChild('grid2') grid2: SheetComponent;
  private columnHeaders2: object[] = [
    { title: '部材名', align: 'center', dataType: 'string', dataIndx: 'g_name', sortable: false, width: 110 },
    { title: '算出点名', align: 'left', dataType: 'string', dataIndx: 'p_name_ex', editable: false, sortable: false, width: 250, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' }  },
    { title: '耐久性・使用性', align: 'center', colModel: [
      { title: '設計耐力検討用', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case0_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case0_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case0_Nd', sortable: false, width: 70 }
      ]},
      { title: '永久作用による<br/>断面力', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case1_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case1_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case1_Nd', sortable: false, width: 70 }
      ]},
      { title: '変動作用による<br/>断面力', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case2_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case2_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case2_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '疲労', align: 'center', colModel: [
      { title: '最小応力', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case3_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case3_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case3_Nd', sortable: false, width: 70 }
      ]},
      { title: '最大応力', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case4_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case4_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case4_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '破壊', align: 'center', colModel: [
      { title: '設計断面力', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case5_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case5_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case5_Nd', sortable: false, width: 70 }
      ]},
    ]},
    { title: '復旧性', align: 'center', colModel: [
      { title: '地震時以外', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case6_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case6_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case6_Nd', sortable: false, width: 70 }
      ]},
      { title: '地震時', align: 'center', colModel: [
        { title: 'Vd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case7_Vd', sortable: false, width: 70 },
        { title: 'Md<br/>(kN/m)', dataType: 'float', 'format': '#.00', dataIndx: 'case7_Md', sortable: false, width: 70 },
        { title: 'Nd<br/>(kN)',   dataType: 'float', 'format': '#.00', dataIndx: 'case7_Nd', sortable: false, width: 70 }
      ]},
    ]},
  ];
  private ROWS_COUNT2 = 0;
  private table_datas2: any[] = [];
  public options2: pq.gridT.options;


  ngOnInit() {
    // データを登録する
    this.ROWS_COUNT1 = this.rowsCount();
    this.loadData1(this.ROWS_COUNT1);

    this.ROWS_COUNT2 = this.rowsCount();
    this.loadData2(this.ROWS_COUNT2);

    // 曲げモーメントグリッドの初期化 --------------------------------------
    this.options1 = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      height: this.tableHeight().toString(),
      numberCell: { show: true }, // 行番号
      colModel: this.columnHeaders1,
      dataModel: { data: this.table_datas1 },
      beforeTableView:(evt, ui) => {
        const dataV = this.table_datas1.length;
        if (ui.initV == null) {
          return;
        }
        if (ui.finalV >= dataV - 1) {
          this.loadData1(dataV + this.ROWS_COUNT1);
          this.grid1.refreshDataAndView();
        }
      }
    };

    // せん断力グリッドの初期化 ------------------------------------------
    this.options2 = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: 'jp',
      height: this.tableHeight().toString(),
      numberCell: { show: true }, // 行番号
      colModel: this.columnHeaders2,
      dataModel: { data: this.table_datas2 },
      beforeTableView:(evt, ui) => {
        const dataV = this.table_datas2.length;
        if (ui.initV == null) {
          return;
        }
        if (ui.finalV >= dataV - 1) {
          this.loadData2(dataV + this.ROWS_COUNT2);
          this.grid2.refreshDataAndView();
        }
      }
    };

  }

 
  ngAfterViewInit(){
    this.grid1.options = this.options1;
    this.grid2.options = this.options2;
  }



  // 指定行row まで、曲げモーメント入力データを読み取る
  private loadData1(row: number): void {
    for (let i = this.table_datas1.length + 1; i <= row; i++) {
      const column = this.force.getTable1Columns(i);
      this.table_datas1.push(column);
    }
  }

  // 指定行row まで、せん断力入力データを読み取る
  private loadData2(row: number): void {
    for (let i = this.table_datas1.length + 1; i <= row; i++) {
      const column = this.force.getTable2Columns(i);
      this.table_datas2.push(column);
    }
  }

 
 
  ngOnDestroy(): void {
    this.saveData();
  }
  public saveData(): void {
    this.force.setTable1Columns(this.table_datas1);
    this.force.setTable2Columns(this.table_datas2);
  }


  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = window.innerHeight;
    containerHeight -= 360;
    return containerHeight;
  }

  // 表高さに合わせた行数を計算する
  private rowsCount(): number {
    const containerHeight = this.tableHeight();
    return Math.round(containerHeight / 30);
  }

}
