import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyFatigueMomentService } from "./calc-safety-fatigue-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";

@Component({
  selector: "app-result-safety-fatigue-moment",
  templateUrl: "./result-safety-fatigue-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyFatigueMomentComponent implements OnInit {
  public safetyFatigueMomentPages: any[];

  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public NA: number; // A列車の回数
  public NB: number; // B列車の回数

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyFatigueMomentService,
    private post: SetPostDataService,
    private result: ResultDataService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

    const trainCount: number[] = this.calc.getTrainCount();
    this.NA = trainCount[0];
    this.NB = trainCount[1];

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      return;
    }

    // postする
    const inputJson: string = this.post.getInputJsonString(postData);
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
      this.safetyFatigueMomentPages = this.setSafetyFatiguePages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    let groupeName: string;
    let i = 0;
    const title = "安全性（疲労破壊）曲げモーメントの照査結果";

    //仮
    // const responseMax = responseData.slice(0, this.PostedData.length);
    // const responseMin = responseData.slice(-this.PostedData.length);
    const responseMax = responseData.slice(0, 2); // エラー回避仮コード
    const responseMin = responseData.slice(-2); // エラー回避仮コード
    //仮END

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {
            // 最小応力
            const postdata0 = position.PostData1[j];
            // 変動応力
            const postdata1 = position.PostData0[j];

            // 印刷用データ
            const PrintData = position.PrintData[j];

            // 応力度
            const resultMin = responseMin[i].ResultSigma;
            const resultMax = responseMax[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: title,
                g_name: groupeName,
                columns: new Array(),
              };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultFrd: any = this.calc.calcFrd(
              PrintData,
              postdata0,
              postdata1,
              position,
              resultMin,
              resultMax
            );
            const resultColumn: any = this.getResultString(resultFrd);

            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata0));
            column.push(this.result.getTitleString3(position, postdata0));
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
            column.push(fsk.fsu);
            /////////////// 照査 ///////////////
            column.push(resultColumn.Mdmin);
            column.push(resultColumn.Ndmin);
            column.push(resultColumn.sigma_min);

            column.push(resultColumn.Mrd);
            column.push(resultColumn.Nrd);
            column.push(resultColumn.sigma_rd);

            column.push(resultColumn.fsr200);
            column.push(resultColumn.ratio200);

            column.push(resultColumn.k);
            column.push(resultColumn.ar);
            column.push(resultColumn.N);

            column.push(resultColumn.NA);
            column.push(resultColumn.NB);

            column.push(resultColumn.SASC);
            column.push(resultColumn.SBSC);

            column.push(resultColumn.r1);
            column.push(resultColumn.r2);

            column.push(resultColumn.rs);
            column.push(resultColumn.frd);

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

  private getResultString(re: any): any {
    const result: any = {
      Mdmin: { alien: "center", value: "-" },
      Ndmin: { alien: "center", value: "-" },
      sigma_min: { alien: "center", value: "-" },

      Mrd: { alien: "center", value: "-" },
      Nrd: { alien: "center", value: "-" },
      sigma_rd: { alien: "center", value: "-" },

      fsr200: { alien: "center", value: "-" },
      ratio200: { alien: "center", value: "-" },

      k: { alien: "center", value: "-" },
      ar: { alien: "center", value: "-" },
      N: { alien: "center", value: "-" },

      NA: { alien: "center", value: "-" },
      NB: { alien: "center", value: "-" },

      SASC: { alien: "center", value: "-" },
      SBSC: { alien: "center", value: "-" },

      r1: { alien: "center", value: "-" },
      r2: { alien: "center", value: "-" },

      rs: { alien: "center", value: "-" },
      frd: { alien: "center", value: "-" },

      ri: { alien: "center", value: "-" },
      ratio: { alien: "center", value: "-" },
      result: { alien: "center", value: "-" },
    };

    if ("Mdmin" in re) {
      result.Mdmin = { alien: "right", value: re.Mdmin.toFixed(1) };
    }
    if ("Ndmin" in re) {
      result.Ndmin = { alien: "right", value: re.Ndmin.toFixed(1) };
    }
    if ("sigma_min" in re) {
      result.sigma_min = { alien: "right", value: re.sigma_min.toFixed(2) };
    }

    if ("Mrd" in re) {
      result.Mrd = { alien: "right", value: re.Mrd.toFixed(1) };
    }
    if ("Nrd" in re) {
      result.Nrd = { alien: "right", value: re.Nrd.toFixed(1) };
    }
    if ("sigma_rd" in re) {
      result.sigma_rd = { alien: "right", value: re.sigma_rd.toFixed(2) };
    }

    if ("fsr200" in re) {
      result.fsr200 = { alien: "right", value: re.fsr200.toFixed(2) };
    }
    if ("ratio200" in re) {
      result.ratio200.value = re.ratio200.toFixed(3);
    }

    if ("k" in re) {
      result.k = { alien: "right", value: re.k.toFixed(2) };
    }
    if ("ar" in re) {
      result.ar = { alien: "right", value: re.ar.toFixed(3) };
    }
    if ("N" in re) {
      result.N = { alien: "right", value: re.N.toFixed(0) };
    }

    if ("NA" in re) {
      result.NA = { alien: "right", value: re.NA.toFixed(2) };
    }
    if ("NB" in re) {
      result.NB = { alien: "right", value: re.NB.toFixed(2) };
    }
    if ("SASC" in re) {
      result.SASC = { alien: "right", value: re.SASC.toFixed(3) };
    }
    if ("SBSC" in re) {
      result.SBSC = { alien: "right", value: re.SBSC.toFixed(3) };
    }
    if ("r1" in re) {
      result.r1 = { alien: "right", value: re.r1.toFixed(2) };
    }
    if ("r2" in re) {
      result.r2 = { alien: "right", value: re.r2.toFixed(3) };
    }
    if ("rs" in re) {
      result.rs = { alien: "right", value: re.rs.toFixed(2) };
    }
    if ("frd" in re) {
      result.frd = { alien: "right", value: re.frd.toFixed(2) };
    }
    if ("ri" in re) {
      result.ri = { alien: "right", value: re.ri.toFixed(2) };
    }
    let ratio = 0;
    if ("ratio" in re) {
      result.ratio.value = re.ratio.toFixed(3);
      ratio = re.ratio;
    }
    if (ratio < 1) {
      result.result.value = "OK";
    } else {
      result.result.value = "NG";
    }

    return result;
  }
}
