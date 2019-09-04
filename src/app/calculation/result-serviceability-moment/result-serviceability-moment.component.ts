import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-serviceability-moment',
  templateUrl: './result-serviceability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultServiceabilityMomentComponent implements OnInit {
  private serviceabilityMomentPages: any[];

  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private safetyMomentPages: any[];

  constructor(private http: Http,
              private calc: CalcServiceabilityMomentService,
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
    this.serviceabilityMomentPages = this.setServiceabilityPages(json, postData);
    return true;
  }

  // 出力テーブル用の配列にセット
  public setServiceabilityPages(responseData: any, postData: any, title: string = '耐久性　曲げひび割れの照査結果'): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: title, columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });

        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });
        column.push({ alien: 'right', value: '12707.2' });
        column.push({ alien: 'center', value: 'D32-16 本' });
        column.push({ alien: 'right', value: '114.0' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'center', value: '一般の環境' });

        column.push({ alien: 'right', value: '80.9' });
        column.push({ alien: 'right', value: '112.9' });
        column.push({ alien: 'center', value: '0.52 < 2.59' });

        column.push({ alien: 'right', value: '44.7' });
        column.push({ alien: 'right', value: '97.2' });
        column.push({ alien: 'center', value: '0.76 < 10.8' });
        column.push({ alien: 'center', value: '9.1 < 140' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: 'OK' });

        page.columns.push(column);
      }
      result.push(page);
    }

    return result;
  }
}

