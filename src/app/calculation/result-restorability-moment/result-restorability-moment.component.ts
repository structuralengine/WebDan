import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-restorability-moment',
  templateUrl: './result-restorability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultRestorabilityMomentComponent implements OnInit {

  private title = "復旧性（地震時以外）曲げモーメントの照査";
  private page_index = "ap_8";
  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private restorabilityMomentPages: any[];

  constructor(private http: Http,
    private calc: CalcRestorabilityMomentService,
    private post: SetPostDataService) { }

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
    this.restorabilityMomentPages = this.calc.setRestorabilityPages(json.OutputData, postData);
    return true;
  }

}

