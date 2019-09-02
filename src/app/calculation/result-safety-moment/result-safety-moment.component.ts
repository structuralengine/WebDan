import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcSafetyMomentService } from './calc-safety-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';


@Component({
  selector: 'app-result-safety-moment',
  templateUrl: './result-safety-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyMomentComponent implements OnInit {

  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private safetyMomentPages: any[];

  constructor(private http: Http,
    private print: CalcSafetyMomentService,
    private calc: ResultDataService,
    private post: SetPostDataService) { }

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
    this.http.post(this.post.URL, inputJson, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
      .subscribe(
        response => {
          const result: string = response.text();
          this.isFulfilled = this.setPages(result, this.print.DesignForceList);
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
    this.safetyMomentPages = this.setSafetyPages(json.OutputData, postData);
    return true;
  }


  // 出力テーブル用の配列にセット
  private setSafetyPages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();
    let page: any = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };

    let i: number = 0;
    for (const groupe of postData) {
      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData.length; j++) {
            const postdata = position.PostData[j];
            const printData = position.printData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };
            }
            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push(this.calc.getTitleString1(member, position));
            column.push(this.calc.getTitleString2(position, postdata));
            column.push(this.calc.getTitleString3(position));
            ///////////////// 形状 /////////////////
            column.push(this.calc.getShapeString_B(printData));
            column.push(this.calc.getShapeString_H(printData));
            column.push(this.calc.getShapeString_Bt(printData));
            column.push(this.calc.getShapeString_t(printData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.calc.getAsString(printData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.calc.getAsString(printData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.calc.getAsString(printData, 'Ase');
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.calc.getFckString(printData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.calc.getFskString(printData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 照査 ///////////////
            const resultColumn: any = this.getResultString(printData, resultData, position.safety_factor);
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.εcu);
            column.push(resultColumn.εs);
            column.push(resultColumn.x);
            column.push(resultColumn.Mu);
            column.push(resultColumn.rb);
            column.push(resultColumn.Mud);
            column.push(resultColumn.ri);
            column.push(resultColumn.ratio);
            column.push(resultColumn.result);
            page.columns.push(column);
            i++;
          }
        }
      }
      if (page.columns.length > 0) {
        result.push(page);
        page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };
      }
    }
    return result;
  }

  private getResultString(printData: any, resultData: any, safety_facto: any): any {

    const Md: number = printData.Md;
    const Mu: number = resultData.M.Mi;
    const rb: number = safety_facto.rb;
    const Mud: number = Mu / rb;
    const ri: number = safety_facto.ri;
    const ratio: number = Math.abs(ri * Md / Mud);
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Md: { alien: 'right', value: Md.toFixed(1) },
      Nd: { alien: 'right', value: printData.Nd.toFixed(1) },
      εcu: { alien: 'right', value: resultData.M.εc.toFixed(5) },
      εs: { alien: 'right', value: resultData.M.εs.toFixed(5) },
      x: { alien: 'right', value: resultData.M.x.toFixed(1) },
      Mu: { alien: 'right', value: Mu.toFixed(1) },
      rb: { alien: 'right', value: rb.toFixed(2) },
      Mud: { alien: 'right', value: Mud.toFixed(1) },
      ri: { alien: 'right', value: ri.toFixed(2) },
      ratio: { alien: 'right', value: ratio.toFixed(3) },
      result: { alien: 'center', value: result }
    };
  }

}

