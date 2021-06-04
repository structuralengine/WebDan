import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyFatigueMomentService } from "./calc-safety-fatigue-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { SetBarService } from "../set-bar.service";
import { SetSectionService } from "../set-section.service";
import { InputFatiguesService } from "src/app/components/fatigues/fatigues.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";

@Component({
  selector: "app-result-safety-fatigue-moment",
  templateUrl: "./result-safety-fatigue-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyFatigueMomentComponent implements OnInit {
  public safetyFatigueMomentPages: any[] = new Array();

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
    private section: SetSectionService,
    private bar: SetBarService,
    private points: InputDesignPointsService,
    private fatigue: InputFatiguesService,
    private summary: CalcSummaryTableService
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
      this.summary.setSummaryTable("SafetyFatigueMoment");
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
        this.summary.setSummaryTable("SafetyFatigueMoment", this.safetyFatigueMomentPages);
      },
      (error) => {
        this.err = 'error!!' + '\n'; 
        let e: any = error;
        while('error' in e) {
          if('message' in e){ this.err += e.message + '\n'; }
          if('text' in e){ this.err += e.text + '\n'; }
          e = e.error;
        }
        if('message' in e){ this.err += e.message + '\n'; }
        if('stack' in e){ this.err += e.stack; }

        this.isLoading = false;
        this.summary.setSummaryTable("SafetyFatigueMoment");
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

    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {
      const groupeName = this.points.getGroupeName(ig);

      page = {
        caption: this.title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);

      for (const member of groupe[ig]) {
        for (const position of member.positions) {
          const fatigueInfo = this.fatigue.getCalcData(position.index);
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.filter(
              (e) => e.index === position.index && e.side === side
            );
            if (res === undefined || res.length < 1) {
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

            /////////////// まず計算 ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            const shape = this.section.getResult('Md', member, res[0]);
            const Ast: any = this.bar.getResult('Md', shape, res[0], safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcFatigue(
                res, Ast, safety, fatigueInfo)
            );

            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            column.push(this.result.alien(shape.B));
            column.push(this.result.alien(shape.H));
            column.push(this.result.alien(shape.Bt));
            column.push(this.result.alien(shape.t));
            /////////////// 引張鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ast), 'center'));
            column.push(this.result.alien(Ast.AstString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dst), 'center'));
            /////////////// 圧縮鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Asc), 'center'));
            column.push(this.result.alien(Ast.AscString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dsc), 'center'));
            /////////////// 側面鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ase), 'center'));
            column.push(this.result.alien(Ast.AseString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dse), 'center'));
            /////////////// コンクリート情報 ///////////////
            column.push(this.result.alien(fck.fck.toFixed(1), 'center'));
            column.push(this.result.alien(fck.rc.toFixed(2), 'center'));
            column.push(this.result.alien(fck.fcd.toFixed(1), 'center'));
            /////////////// 鉄筋情報 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.fsy, 1), 'center'));
            column.push(this.result.alien(Ast.rs.toFixed(2), 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.fsd, 1), 'center'));
            column.push(this.result.alien(Ast.fsu, 'center'));
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

            /////////////// 総括表用 ///////////////
            column.push(position.index);
            column.push(side);
            column.push(shape.shape);

            page.columns.push(column);
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
