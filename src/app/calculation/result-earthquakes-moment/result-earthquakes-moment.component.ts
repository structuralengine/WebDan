import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { CalcEarthquakesMomentService } from "./calc-earthquakes-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultRestorabilityMomentComponent } from "../result-restorability-moment/result-restorability-moment.component";

@Component({
  selector: "app-result-earthquakes-moment",
  templateUrl:
    "../result-restorability-moment/result-restorability-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultEarthquakesMomentComponent implements OnInit {
  public title = "復旧性（地震時）曲げモーメントの照査";
  public page_index = "ap_10";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public restorabilityMomentPages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcEarthquakesMomentService,
    private post: SetPostDataService,
    private base: ResultRestorabilityMomentComponent
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      return;
    }

    // postする
    console.log(this.title, postData);
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, this.post.options).subscribe(
      (response) => {
        if (response["ErrorException"] === null) {
          this.isFulfilled = this.setPages(postData, response["OutputData"]);
          this.calc.isEnable = true;
        } else {
          this.err = JSON.stringify(response["ErrorException"]);
        }
        this.isLoading = false;
      },
      (error) => {
        this.err = error.toString();
        this.isLoading = false;
      }
    );
  }

  // 計算結果を集計する
  private setPages(postData: any, OutputData: any): boolean {
    try {
      this.restorabilityMomentPages = this.base.setRestorabilityPages(
        postData, OutputData,
        "復旧性（地震時）曲げモーメントの照査結果"
      );
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }
}
