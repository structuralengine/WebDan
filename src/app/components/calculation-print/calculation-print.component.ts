import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InputCalclationPrintService } from './calclation-print.service';
import { SaveDataService } from '../../providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-calculation-print',
  templateUrl: './calculation-print.component.html',
  styleUrls: ['./calculation-print.component.scss']
})
export class CalculationPrintComponent implements OnInit, OnDestroy {

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

  public isManual(): boolean{
    return this.save.isManual();
  }

}
