import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyMomentService } from "./calc-safety-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";

@Component({
  selector: "app-result-safety-moment",
  templateUrl: "./result-safety-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyMomentComponent implements OnInit {
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyMomentPages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyMomentService,
    private post: SetPostDataService,
    private result: ResultDataService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      return;
    }

    // postする
    const inputJson: string = this.post.getInputJsonString(postData);
    console.log(inputJson);
    this.http.post(this.post.URL, inputJson, this.post.options).subscribe(
      (response) => {
        if (response["ErrorException"] === null) {
          this.isFulfilled = this.setPages(response["OutputData"]);
          this.calc.isEnable = true;
        } else {
          this.err = JSON.stringify(response["ErrorException"]);
        }
        this.isLoading = false;
      },
      (error) => {
        this.err = error.toString();
        this.isLoading = false;
      }
    );
  }

    // 計算結果を集計する
    private setPages(OutputData: any): boolean {
      try {
        this.safetyMomentPages = this.setSafetyPages(OutputData);
        return true;
      } catch(e) {
        this.err = e.toString();
        return false;
      }
    }


  // 出力テーブル用の配列にセット
  public setSafetyPages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = {
        caption: "安全性（破壊）曲げモーメントの照査結果",
        g_name: groupeName,
        columns: new Array(),
      };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {
            const postdata = position.PostData0[j];
            const PrintData = position.PrintData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: "安全性（破壊）曲げモーメントの照査結果",
                g_name: groupeName,
                columns: new Array(),
              };
            }
            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position, postdata));
            ///////////////// 形状 /////////////////
            column.push(this.result.getShapeString_B(PrintData));
            column.push(this.result.getShapeString_H(PrintData));
            column.push(this.result.getShapeString_Bt(PrintData));
            column.push(this.result.getShapeString_t(PrintData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(PrintData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(PrintData, "Asc");
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(PrintData, "Ase");
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 照査 ///////////////
            const resultColumn: any = this.calc.getResultString(
              PrintData,
              resultData,
              position.safety_factor
            );
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
      }
    }
    return result;
  }
}
