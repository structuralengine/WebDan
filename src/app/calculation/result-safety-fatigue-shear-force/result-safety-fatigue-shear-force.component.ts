import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcSafetyFatigueShearForceService } from './calc-safety-fatigue-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';


@Component({
  selector: 'app-result-safety-fatigue-shear-force',
  templateUrl: './result-safety-fatigue-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyFatigueShearForceComponent implements OnInit {

  private isLoading = true;
  private isFulfilled = false;
  private err: string;  
  private safetyFatigueShearForcepages: any[];
  
  constructor(private http: Http,
    private calc: CalcSafetyFatigueShearForceService,
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
    this.safetyFatigueShearForcepages = this.setSafetyFatiguePages(json, postData);
    return true;
  }
  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: '安全性（疲労破壊）せん断力の照査結果', columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });

        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });

        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '390' });

        column.push({ alien: 'right', value: '506.8' });
        column.push({ alien: 'center', value: 'D32-4 本' });
        column.push({ alien: 'right', value: '345' });
        column.push({ alien: 'right', value: '90' });
        column.push({ alien: 'right', value: '250' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '0' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '44.18' });

        column.push({ alien: 'right', value: '0.529' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '362.6' });

        column.push({ alien: 'right', value: '0.5' });
        column.push({ alien: 'right', value: '65.7' });
        column.push({ alien: 'right', value: '48.4' });

        column.push({ alien: 'right', value: '48.4' });
        column.push({ alien: 'right', value: '103.5' });
        column.push({ alien: 'right', value: '0.468' });
        column.push({ alien: 'right', value: '0.06' });
        column.push({ alien: 'right', value: '2.662' });
        column.push({ alien: 'right', value: '17520000' });
        column.push({ alien: 'right', value: '8.00' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '0.65' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '1.05' });
        column.push({ alien: 'right', value: '169.06' });
        column.push({ alien: 'right', value: '1.10' });
        column.push({ alien: 'right', value: '1.00' });

        column.push({ alien: 'right', value: '0.210' });
        column.push({ alien: 'center', value: 'OK' });

        page.columns.push(column);
      }
      result.push(page);
    }

    return result;
  }
}
