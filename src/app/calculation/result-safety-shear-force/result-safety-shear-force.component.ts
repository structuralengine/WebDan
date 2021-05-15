import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';


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
              private post: SetPostDataService,
              private result: ResultDataService ) { }

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
    this.safetyShearForcePages = this.getSafetyPages(json.OutputData, postData);
    return true;
  }

  // 出力テーブル用の配列にセット
  public getSafetyPages(
    responseData: any,
    postData: any,
    title: string = '安全性（破壊）せん断力の照査結果'): any[] {

    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {
            const postdata = position.PostData0[j];
            const PrintData = position.PrintData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultVmu: any = this.calc.calcVmu(PrintData, resultData, position);
            const resultColumn: any = this.calc.getResultString(PrintData, resultVmu);
            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position, postdata));

            ///////////////// 形状 /////////////////
            column.push(this.getShapeString_B(PrintData));
            column.push(this.getShapeString_H(PrintData));
            column.push(resultColumn.tan);
            /////////////// 引張鉄筋 ///////////////
            column.push(resultColumn.As);
            column.push(resultColumn.AsString);
            column.push(resultColumn.dst);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(PrintData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(PrintData, 'Ase');
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.Vd);
            column.push(resultColumn.La);

            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.Aw);
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);

            /////////////// 照査 ///////////////
            column.push(resultColumn.fvcd);
            column.push(resultColumn.Bd);
            column.push(resultColumn.Bp);
            column.push(resultColumn.Mu);
            column.push(resultColumn.Mo);
            column.push(resultColumn.Bn);
            column.push(resultColumn.ad);
            column.push(resultColumn.Ba);
            column.push(resultColumn.pw);
            column.push(resultColumn.Bw);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);
            column.push(resultColumn.rbs);
            column.push(resultColumn.Vsd);
            column.push(resultColumn.Vyd);
            column.push(resultColumn.ri);
            column.push(resultColumn.Vyd_Ratio);
            column.push(resultColumn.Vyd_Result);

            column.push(resultColumn.fwcd);
            column.push(resultColumn.Vwcd);
            column.push(resultColumn.Vwcd_Ratio);
            column.push(resultColumn.Vwcd_Result);

            page.columns.push(column);
            i++;
          }
        }
      }
      if (page.columns.length > 0) {
        result.push(page);
      }
    }
    return result;
  }

    // 照査表における 断面幅の文字列を取得
    public getShapeString_B(PrintData: any): any {

      const result = {alien: 'center', value: ''};
      switch (PrintData.shape) {
        case 'Circle':            // 円形
          result.value = 'R ' + PrintData.R.toString();
          break;
        case 'Ring':              // 円環
          result.value = 'R ' + PrintData.R.toString();
          result.value += ', ';
          result.value += 'r ' + PrintData.r.toString();
          break;
        case 'HorizontalOval':    // 水平方向小判形
        case 'VerticalOval':      // 鉛直方向小判形
        case 'InvertedTsection':  // 逆T形
        case 'Tsection':          // T形
        case 'Rectangle':         // 矩形
        default:
          result.value = PrintData.B.toString();
          break;
      }
      return result;
    }
  
    // 照査表における 断面高さの文字列を取得
    public getShapeString_H(PrintData: any): any {
  
      const result = {alien: 'center', value: ''};
      switch (PrintData.shape) {
        case 'Circle':            // 円形
          result.value = '□ ' + PrintData.Vyd_H.toFixed(1);
          break;
        case 'Ring':              // 円環
          result.value = 'H ' + PrintData.Vyd_H.toFixed(1);
          result.value += ', ';
          result.value += 'B ' + PrintData.Vyd_B.toFixed(1);
          break;
        case 'HorizontalOval':    // 水平方向小判形
        case 'VerticalOval':      // 鉛直方向小判形
        case 'InvertedTsection':  // 逆T形
        case 'Tsection':          // T形
        case 'Rectangle':         // 矩形
        default:
          result.value = PrintData.H.toString();
          break;
      }
      return result;
    }

}
