import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import pq from 'pqgrid';
import { AppComponent } from 'src/app/app.component';
import { SheetComponent } from '../sheet/sheet.component';
import { InputSectionForcesService } from './input-section-forces.service';

@Component({
  selector: 'app-section-forces',
  templateUrl: './section-forces.component.html',
  styleUrls: ['./section-forces.component.scss']
})
export class SectionForcesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('grid1') grid1: SheetComponent;
  private columnHeaders1: object[] = [
    { title: '部材<br/>番号', align: 'center', dataType: 'string', dataIndx: 'm_no', editable: false, sortable: false, width: 50, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
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
  private Mtable_datas: any[] = [];
  public options1: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: 'jp',
    height: this.tableHeight().toString(),
    numberCell: { show: false }, // 行番号
    colModel: this.columnHeaders1,
    dataModel: { data: this.Mtable_datas },
  };

  @ViewChild('grid2') grid2: SheetComponent;
  private columnHeaders2: object[] = [
    { title: '部材<br/>番号', align: 'center', dataType: 'string', dataIndx: 'm_no', editable: false, sortable: false, width: 50, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
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
  private Vtable_datas: any[] = [];
  public options2: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: 'jp',
    height: this.tableHeight().toString(),
    numberCell: { show: false }, // 行番号
    colModel: this.columnHeaders2,
    dataModel: { data: this.Vtable_datas },
  };

  constructor(
    private app: AppComponent,
    private input: InputSectionForcesService) { }

  ngOnInit() {

    // 曲げモーメントの初期化
    this.Mtable_datas = new Array();
    for (const data of this.input.getMdtableColumns()) {
      const column = { 'm_no': data['m_no'] };
      column['p_name_ex'] = data['p_name_ex'];
      const caseList: any[] = data['case'];
      for (let i = 0; i < caseList.length; i++) {
        column['case' + i + '_Md'] = caseList[i].Md;
        column['case' + i + '_Nd'] = caseList[i].Nd;
      }
      this.Mtable_datas.push(column);
    }

    // せん断力の初期化
    this.Vtable_datas = new Array();
    for (const data of this.input.getVdtableColumns()) {
      const column = { 'm_no': data['m_no'] };
      column['p_name_ex'] = data['p_name_ex'];
      const caseList: any[] = data['case'];
      for (let i = 0; i < caseList.length; i++) {
        column['case' + i + '_Vd'] = caseList[i].Vd;
        column['case' + i + '_Md'] = caseList[i].Md;
        column['case' + i + '_Nd'] = caseList[i].Nd;
      }
      this.Vtable_datas.push(column);
    }
  }

  ngAfterViewInit() {
    this.grid1.options = this.options1;
    this.grid1.refreshDataAndView();
    this.grid2.options = this.options2;
    this.grid2.refreshDataAndView();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.saveData();
  }
  public saveData(): void {
    this.input.setMdtableColumns(this.Mtable_datas);
    this.input.setVdtableColumns(this.Vtable_datas);
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = window.innerHeight;
    containerHeight -= 360;
    return containerHeight;
  }

}
