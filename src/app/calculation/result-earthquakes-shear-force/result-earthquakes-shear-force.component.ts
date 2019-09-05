import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcEarthquakesShearForceService } from './calc-earthquakes-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

@Component({
  selector: 'app-result-earthquakes-shear-force',
  templateUrl: '../result-safety-shear-force/result-safety-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultEarthquakesShearForceComponent implements OnInit {

  private title: string = '復旧性（地震時）';
  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private safetyShearForcePages: any[];

  constructor(private http: Http,
    private calc: CalcEarthquakesShearForceService,
    private result: ResultDataService,
    private post: SetPostDataService,
    private base: CalcSafetyShearForceService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.calc.getPostData();
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
    // 安全性破壊のページと同じ
    this.safetyShearForcePages = this.base.getSafetyPages(json.OutputData, postData, '復旧性（地震時）せん断力の照査結果');
    return true;
  }


}
