import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { InputSectionForcesService } from './input-section-forces.service';

@Component({
  selector: 'app-section-forces',
  templateUrl: './section-forces.component.html',
  styleUrls: ['./section-forces.component.scss']
})
export class SectionForcesComponent implements OnInit, OnDestroy {
  @ViewChild('ht_container') ht_container: ElementRef;
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
}
