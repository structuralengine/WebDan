import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcDurabilityMomentService } from "./calc-durability-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultServiceabilityMomentComponent } from "../result-serviceability-moment/result-serviceability-moment.component";
import { CalcSafetyMomentService } from "../result-safety-moment/calc-safety-moment.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";

@Component({
  selector: "app-result-durability-moment",
  templateUrl:
    "../result-serviceability-moment/result-serviceability-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultDurabilityMomentComponent implements OnInit {
  public title: string = "使用性の検討";
  public page_index = "ap_7";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public serviceabilityMomentPages: any[] = new Array();

  constructor(
    private http: HttpClient,
    private calc: CalcDurabilityMomentService,
    private post: SetPostDataService,
    private base: ResultServiceabilityMomentComponent,
    private summary: CalcSummaryTableService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      this.summary.setSummaryTable("durabilityMoment");
      return;
    }

    // postする
    console.log(this.title, postData);
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, this.post.options).subscribe(
      (response) => {
        if (response["ErrorException"] === null) {
          this.isFulfilled = this.setPages(response["OutputData"]);
          this.calc.isEnable = true;
        } else {
          this.err = JSON.stringify(response["ErrorException"]);
        }
        this.isLoading = false;
        this.summary.setSummaryTable("durabilityMoment", this.serviceabilityMomentPages);
      },
      (error) => {
        this.err = 'error!!' + '\n'; 
        let e: any = error;
        while('error' in e) {
          if('message' in e){ this.err += e.message + '\n'; }
          if('text' in e){ this.err += e.text + '\n'; }
          e = e.error;
        }
        if('message' in e){ this.err += e.message + '\n'; }
        if('stack' in e){ this.err += e.stack; }

        this.isLoading = false;
        this.summary.setSummaryTable("durabilityMoment");
      }
    );
  }
  // 計算結果を集計する
  private setPages(OutputData: any): boolean {
    try {
      // 耐久性のページと同じ
      this.serviceabilityMomentPages = this.base.setServiceabilityPages(
        OutputData,
        "使用性（外観）曲げひび割れの照査結果"
      );
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

}
