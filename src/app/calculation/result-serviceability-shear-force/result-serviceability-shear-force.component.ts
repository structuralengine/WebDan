import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';


import { CalcServiceabilityShearForceService } from './calc-serviceability-shear-force.service';
import { ResultDataService } from '../result-data.service';


@Component({
  selector: 'app-result-serviceability-shear-force',
  templateUrl: './result-serviceability-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultServiceabilityShearForceComponent implements OnInit {

  private isLoading = true;
  private isFulfilled = false;
  private err: string;  
  private serviceabilityShearForcePages: any[];

  constructor(private http: Http,
    private print: CalcServiceabilityShearForceService,
    private calc: ResultDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.print.getPostData();
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
    this.http.post(this.calc.URL, inputJson, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
      .subscribe(
        response => {
          const result: string = response.text();
          this.isFulfilled = this.setPages(result, postData);
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
    if (response.slice(0, 7).indexOf('Error') > 0) {
      this.err = response;
      return false;
    }
    const json = JSON.parse(response);
    this.serviceabilityShearForcePages = this.print.setServiceabilityPages(json, postData);
    return true;
  }

}
