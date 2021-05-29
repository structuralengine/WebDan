import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcEarthquakesShearForceService } from "./calc-earthquakes-shear-force.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { ResultSafetyShearForceComponent } from "../result-safety-shear-force/result-safety-shear-force.component";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";

@Component({
  selector: "app-result-earthquakes-shear-force",
  templateUrl:
    "../result-safety-shear-force/result-safety-shear-force.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultEarthquakesShearForceComponent implements OnInit {
  public title: string = "復旧性（地震時）";
  public page_index = "ap_11";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyShearForcePages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcEarthquakesShearForceService,
    private result: ResultDataService,
    private post: SetPostDataService,
    private base: ResultSafetyShearForceComponent,
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
      this.summary.setSummaryTable("earthquakesShearForce", null);
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
        this.summary.setSummaryTable("earthquakesShearForce", this.safetyShearForcePages);
      },
      (error) => {
        this.summary.setSummaryTable("earthquakesShearForce", null);
        this.err = error.toString();
        this.isLoading = false;
      }
    );
  }

  // 計算結果を集計する
  private setPages( OutputData: any): boolean {
    try {
      // 安全性破壊のページと同じ
      this.safetyShearForcePages = this.base.getSafetyPages(
        OutputData,
        "復旧性（地震時）せん断力の照査結果",
        this.calc.DesignForceList
      );
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }
}
