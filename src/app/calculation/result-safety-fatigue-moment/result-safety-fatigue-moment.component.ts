import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyFatigueMomentService } from "./calc-safety-fatigue-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { InputFatiguesService } from "src/app/components/fatigues/fatigues.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

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
  public page_index = 'ap_3';

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyFatigueMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private helper: DataHelperModule,
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
            const fck: any = this.helper.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcFatigue(
                res, Ast, safety, fatigueInfo)
            );

            const column = {
            /////////////// タイトル ///////////////
            m_no : { alien: 'center', value: titleColumn.m_no },
            p_name : { alien: 'center', value: titleColumn.p_name },
            side : { alien: 'center', value: titleColumn.side },
            ///////////////// 形状 /////////////////
            B : this.result.alien(shape.B),
            H : this.result.alien(shape.H),
            Bt : this.result.alien(shape.Bt),
            t : this.result.alien(shape.t),
            /////////////// 引張鉄筋 ///////////////
            Ast : this.result.alien(this.result.numStr(Ast.Ast), 'center'),
            AstString : this.result.alien(Ast.AstString, 'center'),
            dst : this.result.alien(this.result.numStr(Ast.dst), 'center'),
            /////////////// 圧縮鉄筋 ///////////////
            Asc : this.result.alien(this.result.numStr(Ast.Asc), 'center'),
            AscString : this.result.alien(Ast.AscString, 'center'),
            dsc : this.result.alien(this.result.numStr(Ast.dsc), 'center'),
            /////////////// 側面鉄筋 ///////////////
            Ase : this.result.alien(this.result.numStr(Ast.Ase), 'center'),
            AseString : this.result.alien(Ast.AseString, 'center'),
            dse : this.result.alien(this.result.numStr(Ast.dse), 'center'),
            /////////////// コンクリート情報 ///////////////
            fck : this.result.alien(fck.fck.toFixed(1), 'center'),
            rc : this.result.alien(fck.rc.toFixed(2), 'center'),
            fcd : this.result.alien(fck.fcd.toFixed(1), 'center'),
            /////////////// 鉄筋情報 ///////////////
            fsy : this.result.alien(this.result.numStr(Ast.fsy, 1), 'center'),
            rs : this.result.alien(Ast.rs.toFixed(2), 'center'),
            fsd : this.result.alien(this.result.numStr(Ast.fsd, 1), 'center'),
            fsu : this.result.alien(Ast.fsu, 'center'),
            /////////////// 照査 ///////////////
            Mdmin : resultColumn.Mdmin,
            Ndmin : resultColumn.Ndmin,
            sigma_min : resultColumn.sigma_min,

            Mrd : resultColumn.Mrd,
            Nrd : resultColumn.Nrd,
            sigma_rd : resultColumn.sigma_rd,

            fsr200 : resultColumn.fsr200,
            ratio200 : resultColumn.ratio200,

            k : resultColumn.k,
            ar : resultColumn.ar,
            N : resultColumn.N,

            NA : resultColumn.NA,
            NB : resultColumn.NB,

            SASC : resultColumn.SASC,
            SBSC : resultColumn.SBSC,

            r1 : resultColumn.r1,
            r2 : resultColumn.r2,

            rs2 : resultColumn.rs,
            frd : resultColumn.frd,

            ri : resultColumn.ri,
            ratio : resultColumn.ratio,
            result : resultColumn.result,

            /////////////// 総括表用 ///////////////
            index_summary : position.index,
            side_summary : side,
            shape_summary : shape.shape,
            }

            page.columns.push(column);
          }
        }
      }
      // 最後のページ
      if (page.columns.length > 0) {
        for(let i=page.columns.length; i<5; i++){
          const column = {};
          for (let aa of Object.keys(page.columns[0])) {
            if (aa === "index_summary" || aa === "side_summary" || aa === "shape_summary") {
              column[aa] = null;
            } else {
              column[aa] = { alien: 'center', value: '-' };
            }
          }
          page.columns.push(column);
        }
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
      result.Mdmin = { alien: "right", value: (Math.round(re.Mdmin*10)/10).toFixed(1) };
    }
    if ("Ndmin" in re) {
      result.Ndmin = { alien: "right", value: (Math.round(re.Ndmin*10)/10).toFixed(1) };
    }
    if ("sigma_min" in re) {
      result.sigma_min = { alien: "right", value: re.sigma_min.toFixed(2) };
    }

    if ("Mrd" in re) {
      result.Mrd = { alien: "right", value: (Math.round(re.Mrd*10)/10).toFixed(1) };
    }
    if ("Nrd" in re) {
      result.Nrd = { alien: "right", value: (Math.round(re.Nrd*10)/10).toFixed(1) };
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
