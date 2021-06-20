import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyMomentService } from "./calc-safety-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-result-safety-moment",
  templateUrl: "./result-safety-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyMomentComponent implements OnInit {
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyMomentPages: any[] = new Array();
  private title = "安全性（破壊）曲げモーメントの照査結果";
  public page_index = "ap_1";

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private helper: DataHelperModule,
    private points: InputDesignPointsService,
    private summary: CalcSummaryTableService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      this.summary.setSummaryTable("safetyMoment");
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
        this.summary.setSummaryTable("safetyMoment", this.safetyMomentPages);
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
        this.summary.setSummaryTable("safetyMoment");
      }
    );
  }

  // 計算結果を集計する
  private setPages(OutputData: any): boolean {
    try {
      this.safetyMomentPages = this.setSafetyPages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public setSafetyPages(OutputData: any): any[] {
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

      for (const m of groupe[ig]) {
        for (const position of m.positions) {
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.find(
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
            const section = this.result.getSection('Md', res, safety);
   
            const titleColumn = this.result.getTitleString(section.member, position, side)
            const fck: any = this.helper.getFck(safety);

            const resultColumn: any = this.calc.getResultValue(
              res, safety
            );

            const column = {
              /////////////// タイトル ///////////////
              title1: { alien: 'center', value: titleColumn.title1 },
              title2: { alien: 'center', value: titleColumn.title2 },
              title3: { alien: 'center', value: titleColumn.title3 },
              ///////////////// 形状 /////////////////
              B : this.result.alien(section.shape.B),
              H : this.result.alien(section.shape.H),
              Bt : this.result.alien(section.shape.Bt),
              t : this.result.alien(section.shape.t),
              /////////////// 引張鉄筋 ///////////////
              Ast : this.result.alien(this.result.numStr(section.Ast.Ast), 'center'),
              AstString : this.result.alien(section.Ast.AstString, 'center'),
              dst : this.result.alien(this.result.numStr(section.Ast.dst, 1), 'center'),
              /////////////// 圧縮鉄筋 ///////////////
              Asc : this.result.alien(this.result.numStr(section.Asc.Asc), 'center'),
              AscString : this.result.alien(section.Asc.AscString, 'center'),
              dsc : this.result.alien(this.result.numStr(section.Asc.dsc ,1), 'center'),
              /////////////// 側面鉄筋 ///////////////
              Ase : this.result.alien(this.result.numStr(section.Ase.Ase), 'center'),
              AseString : this.result.alien(section.Ase.AseString, 'center'),
              dse : this.result.alien(this.result.numStr(section.Ase.dse, 1), 'center'),
              /////////////// コンクリート情報 ///////////////
              fck : this.result.alien(fck.fck.toFixed(1), 'center'),
              rc : this.result.alien(fck.rc.toFixed(2), 'center'),
              fcd : this.result.alien(fck.fcd.toFixed(1), 'center'),
              /////////////// 鉄筋情報 ///////////////
              fsy : this.result.alien(this.result.numStr(section.Ast.fsy, 1), 'center'),
              rs : this.result.alien(section.Ast.rs.toFixed(2), 'center'),
              fsd : this.result.alien(this.result.numStr(section.Ast.fsd, 1), 'center'),
              /////////////// 照査 ///////////////
              Md : { alien: 'right', value: (Math.round(resultColumn.Md*10)/10).toFixed(1) },
              Nd : { alien: 'right', value: (Math.round(resultColumn.Nd*10)/10).toFixed(1) },
              ecu : { alien: 'right', value: resultColumn.εcu.toFixed(5) },
              es : { alien: 'right', value: resultColumn.εs.toFixed(5) },
              x : { alien: 'right', value: resultColumn.x.toFixed(1) },
              Mu : { alien: 'right', value: resultColumn.Mu.toFixed(1) },
              rb : { alien: 'right', value: resultColumn.rb.toFixed(2) },
              Mud : { alien: 'right', value: resultColumn.Mud.toFixed(1) },
              ri : { alien: 'right', value: resultColumn.ri.toFixed(2) },
              ratio : { alien: 'right', value: resultColumn.ratio.toFixed(3) },
              result : { alien: 'center', value: resultColumn.result },

              /////////////// 総括表用 ///////////////
              g_name: m.g_name,
              index : position.index,
              side_summary : side,
              shape_summary : section.shapeName,
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
            if (aa === "index" || aa === "side_summary" || aa === "shape_summary") {
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
}
