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
        SRCFlag : false,
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);

      let SRCFlag = false;
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
              page.SRCFlag = SRCFlag;
              result.push(page);
              page = {
                caption: this.title,
                g_name: groupeName,
                columns: new Array(),
                SRCFlag : false,
              };
              SRCFlag = false;
            }

            /////////////// まず計算 ///////////////
            const section = this.result.getSection('Md', res, safety);

            const titleColumn = this.result.getTitleString(section.member, position, side)
            const fck: any = this.helper.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.getResultValue(
              res, safety
            ));

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
              ///////////////// 鉄骨情報 /////////////////
              steel_I_tension : this.result.alien(section.steel.I.tension_flange),
              steel_I_web : this.result.alien(section.steel.I.web),
              steel_I_compress : this.result.alien(section.steel.I.compress_flange),
              steel_H_tension : this.result.alien(section.steel.H.left_flange),
              steel_H_web : this.result.alien(section.steel.H.web),
              /////////////// 引張鉄筋 ///////////////
              Ast : this.result.alien(this.result.numStr(section.Ast.Ast), 'center'),
              AstString : this.result.alien(section.Ast.AstString, 'center'),
              dst : this.result.alien(this.result.numStr(section.Ast.dst, 1), 'center'),
              tcos : this.result.alien(this.result.numStr((section.Ast.tension!==null)?section.Ast.tension.cos: 1, 3), "center"),
              /////////////// 圧縮鉄筋 ///////////////
              Asc : this.result.alien(this.result.numStr(section.Asc.Asc), 'center'),
              AscString : this.result.alien(section.Asc.AscString, 'center'),
              dsc : this.result.alien(this.result.numStr(section.Asc.dsc ,1), 'center'),
              ccos : this.result.alien(this.result.numStr((section.Asc.compress!==null)?section.Asc.compress.cos: 1, 3), "center"),
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
              /////////////// 鉄骨情報 ///////////////
              fsy_steel : this.result.alien(this.result.numStr(section.steel.fsy_tension.fsy, 1), 'center'),
              rs_steel : this.result.alien(section.steel.rs.toFixed(2), 'center'),
              fsd_steel : this.result.alien(this.result.numStr(section.steel.fsy_tension.fsd, 1), 'center'),
              /////////////// 照査 ///////////////
              Md : resultColumn.Md,
              Nd : resultColumn.Nd,
              ecu : resultColumn.ecu,
              es : resultColumn.es,
              x : resultColumn.x,
              Mu : resultColumn.Mu,
              rb : resultColumn.rb,
              Mud : resultColumn.Mud,
              ri : resultColumn.ri,
              ratio : resultColumn.ratio,
              result : resultColumn.result,

              /////////////// flag用 ///////////////
              steelFlag: (section.steel.fsy_tension.fsy !== null),

              /////////////// 総括表用 ///////////////
              g_name: m.g_name,
              index : position.index,
              side_summary : side,
              shape_summary : section.shapeName,
            }
            // SRCのデータの有無を確認
            for(const src_key of ['steel_I_tension', 'steel_I_web', 'steel_I_compress',
                                  'steel_H_tension','steel_H_web']){
              if(column[src_key].value !== '-'){
                SRCFlag = true;
              }
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
        page.SRCFlag = SRCFlag;
        result.push(page);
      }
    }
    return result;
  }

  private getResultString(re: any): any {
    const result = {

      Md: { alien: "center", value: "-" },
      Nd: { alien: "center", value: "-" },
      ecu: { alien: "center", value: "-" },
      es: { alien: "center", value: "-" },
      x: { alien: "center", value: "-" },

      Mu: { alien: "center", value: "-" },
      rb: { alien: "center", value: "-" },
      Mud: { alien: "center", value: "-" },

      ri: { alien: "center", value: "-" },
      ratio: { alien: "center", value: "-" },
      result: { alien: "center", value: "-" },

      };

    // 帯鉄筋
    if ("Md" in re) {
      result.Md = { alien: "right", value: (Math.round(re.Md*10)/10).toFixed(1) };
    }
    if ("Nd" in re) {
      result.Nd = { alien: "right", value: (Math.round(re.Nd*10)/10).toFixed(1) };
    }
    if ("ecu" in re) {
      result.ecu = { alien: "right", value: re.εcu.toFixed(5) };
    }
    if ("es" in re) {
      result.es = { alien: "right", value: re.εs.toFixed(5) };
    }
    if ("x" in re) {
      result.x = { alien: "right", value: re.x.toFixed(1) };
    }

    if ("Mu" in re) {
      result.Mu = { alien: "right", value: re.Mu.toFixed(1) };
    }
    if ("rb" in re) {
      result.rb = { alien: "right", value: re.rb.toFixed(2) };
    }
    if ("Mud" in re) {
      result.Mud = { alien: "right", value: re.Mud.toFixed(1) };
    }

    if ("ri" in re) {
      result.ri = { alien: "right", value: re.ri.toFixed(2) };
    }
    let ratio = 0;
    if ("ratio" in re) {
      //result.ratio.value = re.ratio.toFixed(3);
      ratio = re.ratio;
      result.ratio.value = re.ratio.toFixed(3).toString() + ((re.ratio < 1) ? ' < 1.00' : ' < 1.00');
    }
    if (ratio < 1) {
      result.result.value = "OK";
    } else {
      result.result.value = "NG";
    }

    return result;
  }
}
