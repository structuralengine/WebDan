import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcEarthquakesMomentService } from './calc-earthquakes-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcRestorabilityMomentService } from '../result-restorability-moment/calc-restorability-moment.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-result-earthquakes-moment',
  templateUrl: '../result-restorability-moment/result-restorability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultEarthquakesMomentComponent implements OnInit {

  public title = "復旧性（地震時）曲げモーメントの照査";
  public page_index = "ap_10";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public restorabilityMomentPages: any[];

  constructor(private http: HttpClient,
    private calc: CalcEarthquakesMomentService,
    private post: SetPostDataService,
    private base: CalcRestorabilityMomentService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }
    if (postData.InputData0.length < 1) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }

    // postする
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
      .subscribe(
        response => {
          const result: string = JSON.stringify(response);
          this.isFulfilled = this.setPages(result, this.calc.DesignForceList);
          this.isLoading = false;
          this.calc.isEnable = true;
        },
        error => {
          this.err = error.toString();
          this.isLoading = false;
          this.isFulfilled = false;
        });

  }

  // 計算結果を集計する
  private setPages(response: string, postData: any): boolean {
    if (response === null) {
      return false;
    }
    if (response.slice(0, 7).indexOf('Error') >= 0) {
      this.err = response;
      return false;
    }
    const json = this.post.parseJsonString(response);
    if (json === null) { return false; }
    this.restorabilityMomentPages = this.base.setRestorabilityPages(json.OutputData, postData, '復旧性（地震時）曲げモーメントの照査結果');
    return true;
  }

}

