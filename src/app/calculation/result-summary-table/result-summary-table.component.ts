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

  constructor(private calc: CalcSummaryTableService) { }

  ngOnInit() {
    // 初期化
    this.summary_table = new Array();
    // 総括表の index配列を取得
    const keys = Object.keys(this.calc.summary_table);
    keys.sort(); // 並び変える
    // 並び変えた順に登録
    for(const k of keys){
      this.summary_table.push(this.calc.summary_table[k]);
    }
  }

}
