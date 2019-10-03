import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcDurabilityMomentService } from './calc-durability-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';

@Component({
  selector: 'app-result-durability-moment',
  templateUrl: '../result-serviceability-moment/result-serviceability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultDurabilityMomentComponent implements OnInit {

  private title: string = '使用性の検討';
  private page_index = "ap_7";
  public isLoading = true;
  public isFulfilled = false;
  private err: string;
  private serviceabilityMomentPages: any[];

  constructor(private http: Http,
              private calc: CalcDurabilityMomentService,
              private post: SetPostDataService,
              private base: CalcServiceabilityMomentService) {
  }

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
    this.calc.isEnable = false;
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
    // 耐久性のページと同じ
    this.serviceabilityMomentPages = this.base.setServiceabilityPages(json.OutputData, postData, '使用性（外観）曲げひび割れの照査結果');
    return true;
  }

}

