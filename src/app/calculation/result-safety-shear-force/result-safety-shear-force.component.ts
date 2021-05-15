import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-safety-shear-force',
  templateUrl: './result-safety-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyShearForceComponent implements OnInit {

  private title: string = '安全性（破壊）';
  private page_index = "ap_2";
  public isLoading = true;
  public isFulfilled = false;
  private err: string;
  private safetyShearForcePages: any[];

  constructor(private http: HttpClient,
              private calc: CalcSafetyShearForceService,
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
    if (postData.length < 1) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }

    // postする
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, this.post.options)
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
    this.safetyShearForcePages = this.calc.getSafetyPages(json.OutputData, postData);
    return true;
  }


}
