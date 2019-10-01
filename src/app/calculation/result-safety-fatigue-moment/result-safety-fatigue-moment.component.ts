import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcSafetyFatigueMomentService } from './calc-safety-fatigue-moment.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-safety-fatigue-moment',
  templateUrl: './result-safety-fatigue-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyFatigueMomentComponent implements OnInit {
  private safetyFatigueMomentPages: any[];

  public isLoading = true;
  public isFulfilled = false;
  private err: string;
  private safetyMomentPages: any[];

  constructor(private http: Http,
    private calc: CalcSafetyFatigueMomentService,
    private post: SetPostDataService) { }

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
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
      .subscribe(
        response => {
          const result: string = response.text();
          this.isFulfilled = this.setPages(result, this.calc.DesignForceList);
          this.isLoading = false;
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
    this.safetyFatigueMomentPages = this.calc.setSafetyFatiguePages(json.OutputData, postData);
    return true;
  }



}
