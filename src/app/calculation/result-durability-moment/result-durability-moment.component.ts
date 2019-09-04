import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcDurabilityMomentService } from './calc-durability-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultServiceabilityMomentComponent } from '../result-serviceability-moment/result-serviceability-moment.component';

@Component({
  selector: 'app-result-durability-moment',
  templateUrl: './result-durability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultDurabilityMomentComponent implements OnInit {

  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private durabilityMomentPages: any[];

  constructor(private http: Http,
              private calc: CalcDurabilityMomentService,
              private post: SetPostDataService,
              private base: ResultServiceabilityMomentComponent) {
  }

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
    if (postData.InputData.length < 1) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }

    // postする
    const inputJson: string = '=' + JSON.stringify(postData);
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
    // 耐久性のページと同じ
    this.durabilityMomentPages = this.base.setServiceabilityPages(json, postData, '使用性（外観）曲げひび割れの照査結果');
    return true;
  }

}

