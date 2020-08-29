import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-serviceability-moment',
  templateUrl: './result-serviceability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultServiceabilityMomentComponent implements OnInit {

  public title: string = '耐久性の照査';
  public page_index = "ap_5";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public serviceabilityMomentPages: any[];

  constructor(private http: HttpClient,
    private calc: CalcServiceabilityMomentService,
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
    this.serviceabilityMomentPages = this.calc.setServiceabilityPages(json.OutputData, postData);
    return true;
  }


}

