import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcSafetyFatigueMomentService } from './calc-safety-fatigue-moment.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-safety-fatigue-moment',
  templateUrl: './result-safety-fatigue-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyFatigueMomentComponent implements OnInit {
  public safetyFatigueMomentPages: any[];

  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  private safetyMomentPages: any[];
  public NA: number; // A列車の回数
  public NB: number; // B列車の回数

  constructor(private http: HttpClient,
    private calc: CalcSafetyFatigueMomentService,
    private post: SetPostDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    const trainCount: number[] = this.calc.getTrainCount();
    this.NA = trainCount[0];
    this.NB = trainCount[1];
    
    // POST 用データを取得する
    this.calc.setDesignForces();
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
    this.safetyFatigueMomentPages = this.calc.setSafetyFatiguePages(json.OutputData, postData);
    return true;
  }



}

