import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyFatigueMomentService } from "./calc-safety-fatigue-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";

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
  private title = "安全性（疲労破壊）曲げモーメントの照査結果";

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyFatigueMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private points: InputDesignPointsService
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
    console.log(this.title, postData);
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
  public setSafetyFatiguePages(OutputData: any): any[] {
    const result: any[] = new Array();

    let page: any;

    //仮
    // const responseMax = responseData.slice(0, this.PostedData.length);
    // const responseMin = responseData.slice(-this.PostedData.length);
    const responseMax = OutputData.slice(0, 2); // エラー回避仮コード
    const responseMin = OutputData.slice(-2); // エラー回避仮コード
    //仮END

    let i: number = 0;
    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {

      if(groupe[ig].length === 0){
        continue;
      }

      const groupeName = this.points.getGroupeName(ig);
      page = {
        caption: this.title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);


      for (const member of groupe[ig]) {0
        for (const position of member.positions) {
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.filter(
              (e) => e.index === position.index && e.side === side
            );
            if (res === undefined) {
              continue;
            }


            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: this.title,
                g_name: groupeName,
                columns: new Array(),
              };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultColumn: any = this.getResultString(
              this.calc.getResultValue( position, res ));

            /////////////// タイトル ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            const shapeString = this.result.getShapeString('Md', member, res);
            column.push(shapeString.B);
            column.push(shapeString.H);
            column.push(shapeString.Bt);
            column.push(shapeString.t);
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString('Md', shapeString.shape, res, safety);
            column.push(Ast.Ast);
            column.push(Ast.AstString);
            column.push(Ast.dst);
            /////////////// 圧縮鉄筋 ///////////////
            column.push(Ast.Asc);
            column.push(Ast.AscString);
            column.push(Ast.dsc);
            /////////////// 側面鉄筋 ///////////////
            column.push(Ast.Ase);
            column.push(Ast.AseString);
            column.push(Ast.dse);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(position);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(position);
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
