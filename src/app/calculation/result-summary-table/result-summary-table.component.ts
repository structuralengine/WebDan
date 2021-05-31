import { Component, OnInit } from '@angular/core';
import { CalcSummaryTableService } from './calc-summary-table.service';

@Component({
  selector: 'app-result-summary-table',
  templateUrl: './result-summary-table.component.html',
  styleUrls: ['./result-summary-table.component.scss']
})
export class ResultSummaryTableComponent implements OnInit {
  //
  public summary_table: any;

  constructor(private calc: CalcSummaryTableService) {
    
  }

  ngOnInit() {
    this.summary_table = this.calc.summary_table;
  }

}
