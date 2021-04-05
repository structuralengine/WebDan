import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InputCalclationPrintService } from './input-calclation-print.service';
import { SaveDataService } from '../../providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-calculation-print',
  templateUrl: './calculation-print.component.html',
  styleUrls: ['./calculation-print.component.scss']
})
export class CalculationPrintComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: SheetComponent;

  private columnHeaders: object[] = [
    { title: "", dataType: "left", format: "#.000", dataIndx: "calc_checked", type: 'checkbox', sortable: false, width: 70 },
    { title: "", dataType: "string", dataIndx: "g_name", editable: false, sortable: false, width: 250, style: {'background': 'rgba(170, 170, 170)' }, styleHead: {'background': 'rgba(170, 170, 170)' } },
  ];

  isManual: boolean;
  print_calculate_checked: boolean;
  print_section_force_checked: boolean;
  print_summary_table_checked: boolean;

  calculate_moment_checked: boolean;
  calculate_shear_force_checked: boolean;

  table_datas: any[];
  table_settings = {};

  constructor(
    private input: InputCalclationPrintService,
    private save: SaveDataService,
    private router: Router ) { }

  ngOnInit() {
    this.isManual = this.save.isManual();

    this.print_calculate_checked = this.input.print_selected.print_calculate_checked;
    this.print_section_force_checked = this.input.print_selected.print_section_force_checked;
    this.print_summary_table_checked = this.input.print_selected.print_summary_table_checked;

    this.calculate_moment_checked = this.input.print_selected.calculate_moment_checked;
    this.calculate_shear_force_checked = this.input.print_selected.calculate_shear_force;

    this.table_datas = new Array();
    for ( const data of this.input.getColumnData()) {
      this.table_datas.push({
        'calc_checked': data.checked,
        'g_name': data.g_name
      });
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
    this.input.print_selected.print_calculate_checked = this.print_calculate_checked;
    this.input.print_selected.print_section_force_checked = this.print_section_force_checked;
    this.input.print_selected.print_summary_table_checked = this.print_summary_table_checked;

    this.input.print_selected.calculate_moment_checked = this.calculate_moment_checked;
    this.input.print_selected.calculate_shear_force = this.calculate_shear_force_checked;

    this.input.setColumnData(this.table_datas);
  }

  // 計算開始
  onClick() {
    this.router.navigate(['/result-viewer']);
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
