import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import pq from 'pqgrid';
import { SheetComponent } from '../sheet/sheet.component';
import { InputSectionForcesService } from './input-section-forces.service';

@Component({
  selector: 'app-section-forces',
  templateUrl: './section-forces.component.html',
  styleUrls: ['./section-forces.component.scss']
})
export class SectionForcesComponent implements OnInit, OnDestroy {

  @ViewChild('grid_Mtable_datas') grid_Mtable_datas: SheetComponent;
  @ViewChild('grid_Vtable_datas') grid_Vtable_datas: SheetComponent;

  private columnHeaders1: object[] = [
    { title: "部材\n番号", align: "left", dataType: "string", dataIndx: "m_no", editable: false, sortable: false, width: 50, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
    { title: "算出点名", dataType: "integer", dataIndx: "p_name_ex", editable: false, sortable: false, width: 250, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' }  },
    {
      title: "耐久性・使用性", align: "center", colModel: [
        { title: "縁応力検討用", dataType: "integer", sortable: false, colModel: [
          { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case0_Md", sortable: false, width: 70 },
          { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case0_Nd", sortable: false, width: 70 }
        ]},
        { title: "耐久性検討用\n(永久作用)", dataType: "integer", colModel: [
          { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case1_Md", sortable: false, width: 70 },
          { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case1_Nd", sortable: false, width: 70 }
        ]},
      ]},
        {
          title: "疲労", align: "center", colModel: [
            { title: "最小応力", dataType: "integer", sortable: false, colModel: [
              { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case2_Md", sortable: false, width: 70 },
              { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case2_Nd", sortable: false, width: 70 }
            ]},
            { title: "最大応力", dataType: "integer", colModel: [
              { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case3_Md", sortable: false, width: 70 },
              { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case3_Nd", sortable: false, width: 70 }
            ]},
          ]},
            { title: "破壊", dataType: "integer", colModel: [
              { title: "曲げ耐力検討用", dataType: "integer", sortable: false, colModel: [
                { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case4_Md", sortable: false, width: 70 },
                { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case4_Nd", sortable: false, width: 70 }
              ]},
            ]},
            {
              title: "復旧性", align: "center", colModel: [
                { title: "地震時以外", dataType: "integer", sortable: false, colModel: [
                  { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case5_Md", sortable: false, width: 70 },
                  { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case5_Nd", sortable: false, width: 70 }
                ]},
                { title: "地震時", dataType: "integer", colModel: [
                  { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case6_Md", sortable: false, width: 70 },
                  { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case6_Nd", sortable: false, width: 70 }
                ]},
              ]},


  ];

  private columnHeaders2: object[] = [
    { title: "部材\n番号", align: "left", dataType: "string", dataIndx: "m_no", editable: false, sortable: false, width: 50, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
    { title: "算出点名", dataType: "integer", dataIndx: "p_name_ex", editable: false, sortable: false, width: 250, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' }  },
    {
      title: "耐久性・使用性", align: "center", colModel: [
        { title: "設計耐力検討用", dataType: "integer", sortable: false, colModel: [
          { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case0_Vd", sortable: false, width: 70 },
          { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case0_Md", sortable: false, width: 70 },
          { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case0_Nd", sortable: false, width: 70 }
        ]},
        { title: "永久作用による\n断面力", dataType: "integer", colModel: [
          { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case1_Vd", sortable: false, width: 70 },
          { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case1_Md", sortable: false, width: 70 },
          { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case1_Nd", sortable: false, width: 70 }
        ]},
        { title: "変動作用による\n断面力", dataType: "integer", colModel: [
          { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case2_Vd", sortable: false, width: 70 },
          { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case2_Md", sortable: false, width: 70 },
          { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case2_Nd", sortable: false, width: 70 }
        ]},
      ]},
        {
          title: "疲労", align: "center", colModel: [
            { title: "最小応力", dataType: "integer", sortable: false, colModel: [
              { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case3_Vd", sortable: false, width: 70 },
              { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case3_Md", sortable: false, width: 70 },
              { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case3_Nd", sortable: false, width: 70 }
            ]},
            { title: "最大応力", dataType: "integer", colModel: [
              { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case4_Vd", sortable: false, width: 70 },
              { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case4_Md", sortable: false, width: 70 },
              { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case4_Nd", sortable: false, width: 70 }
            ]},
          ]},
            { title: "破壊", dataType: "integer", colModel: [
              { title: "設計断面力", dataType: "integer", sortable: false, colModel: [
                { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case5_Vd", sortable: false, width: 70 },
                { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case5_Md", sortable: false, width: 70 },
                { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case5_Nd", sortable: false, width: 70 }
              ]},
            ]},
            {
              title: "復旧性", align: "center", colModel: [
                { title: "地震時以外", dataType: "integer", sortable: false, colModel: [
                  { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case6_Vd", sortable: false, width: 70 },
                  { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case6_Md", sortable: false, width: 70 },
                  { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case6_Nd", sortable: false, width: 70 }
                ]},
                { title: "地震時", dataType: "integer", colModel: [
                  { title: "Vd\n(kN)", dataType: "integer", dataIndx: "case7_Vd", sortable: false, width: 70 },
                  { title: "Md\n(kN/m)", dataType: "integer", dataIndx: "case7_Md", sortable: false, width: 70 },
                  { title: "Nd\n(kN)", dataType: "integer", dataIndx: "case7_Nd", sortable: false, width: 70 }
                ]},
              ]},


  ];

  @ViewChild('ht_container', { static: true }) ht_container: ElementRef;
  private hottable_height: number;
  private Mtable_datas: any[];
  private Vtable_datas: any[];
  table_settings = {};

  constructor(private input: InputSectionForcesService) { }

  ngOnInit() {
    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 250;

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
  
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.saveData();
  }
  public saveData(): void {
    this.input.setMdtableColumns(this.Mtable_datas);
    this.input.setVdtableColumns(this.Vtable_datas);
  }

   // グリッドの設定
   options1: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    numberCell: { show: false }, // 行番号
    colModel: this.columnHeaders1,
    dataModel: { data: [] },
  };

   options2: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    numberCell: { show: false }, // 行番号
    colModel: this.columnHeaders2,
    dataModel: { data: [] },
  };
}
