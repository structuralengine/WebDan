import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcServiceabilityMomentService } from "./calc-serviceability-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-result-serviceability-moment",
  templateUrl: "./result-serviceability-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultServiceabilityMomentComponent implements OnInit {
  public title: string = "耐久性の照査";
  public page_index = "ap_5";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public serviceabilityMomentPages: any[] = new Array();

  constructor(
    private http: HttpClient,
    private calc: CalcServiceabilityMomentService,
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
      this.summary.setSummaryTable("serviceabilityMoment");
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
        this.summary.setSummaryTable("serviceabilityMoment", this.serviceabilityMomentPages);
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
        this.summary.setSummaryTable("serviceabilityMoment");
      }
    );
  }

  // 計算結果を集計する
  private setPages(OutputData: any): boolean {
    try {
      this.serviceabilityMomentPages = this.setServiceabilityPages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public setServiceabilityPages(
    OutputData: any,
    title: string = null,
    safetyID: number = this.calc.safetyID
  ): any[] {
    const result: any[] = new Array();

    let isDurability = true;
    if (title === null) {
      title = "耐久性　曲げひび割れの照査結果";
      isDurability = false;
    }

    let page: any;

    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {
      const groupeName = this.points.getGroupeName(ig);

      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id, safetyID);

      for (const m of groupe[ig]) {
        for (const position of m.positions) {
          for (const side of ["上側引張", "下側引張"]) {
            const res = OutputData.filter(
              (e) => e.index === position.index && e.side === side
            );
            if (res === undefined || res.length < 2) {
              continue;
            }

            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: title,
                g_name: groupeName,
                columns: new Array(),
              };
            }

            /////////////// まず計算 ///////////////
            const section = this.result.getSection("Md", res[0], safety);
            const member = section.member;
            const shape = section.shape;
            const Ast = section.Ast;

            const titleColumn = this.result.getTitleString( section.member, position, side );
            const fck: any = this.helper.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcWd(
                res,
                section,
                fck,
                safety,
                isDurability
              )
            );

            const column = {
              /////////////// タイトル ///////////////
              title1 : { alien: "center", value: titleColumn.title1 },
              title2 : { alien: "center", value: titleColumn.title2 },
              title3 :  { alien: "center", value: titleColumn.title3 },
              ///////////////// 形状 /////////////////
              B : this.result.alien(shape.B),
              H : this.result.alien(shape.H),
              Bt : this.result.alien(shape.Bt),
              t : this.result.alien(shape.t),
              /////////////// 引張鉄筋 ///////////////
              Ast : this.result.alien(this.result.numStr(section.Ast.Ast), "center"),
              AstString : this.result.alien(section.Ast.AstString, "center"),
              dst : this.result.alien(this.result.numStr(section.Ast.dst), "center"),
              /////////////// 圧縮鉄筋 ///////////////
              Asc : this.result.alien(this.result.numStr(section.Asc.Asc), "center"),
              AscString : this.result.alien(section.Asc.AscString, "center"),
              dsc : this.result.alien(this.result.numStr(section.Asc.dsc), "center"),
              /////////////// 側面鉄筋 ///////////////
              Ase : this.result.alien(this.result.numStr(section.Ase.Ase), "center"),
              AseString : this.result.alien(section.Ase.AseString, "center"),
              dse : this.result.alien(this.result.numStr(section.Ase.dse), "center"),
              /////////////// コンクリート情報 ///////////////
              fck : this.result.alien(fck.fck.toFixed(1), "center"),
              rc : this.result.alien(fck.rc.toFixed(2), "center"),
              fcd : this.result.alien(fck.fcd.toFixed(1), "center"),
              /////////////// 鉄筋情報 ///////////////
              fsy : this.result.alien(this.result.numStr(section.Ast.fsy, 1), "center"),
              rs : this.result.alien(section.Ast.rs.toFixed(2), "center"),
              fsd : this.result.alien(this.result.numStr(section.Ast.fsd, 1), "center"),
              /////////////// 照査 ///////////////
              con : resultColumn.con,

              Mhd : resultColumn.Mhd,
              Nhd : resultColumn.Nhd,
              sigma_b : resultColumn.sigma_b,

              Md : resultColumn.Md,
              Nd : resultColumn.Nd,
              sigma_c : resultColumn.sigma_c,
              sigma_s : resultColumn.sigma_s,

              Mpd : resultColumn.Mpd,
              Npd : resultColumn.Npd,
              EsEc : resultColumn.EsEc,
              sigma_se : resultColumn.sigma_se,
              c : resultColumn.c,
              Cs : resultColumn.Cs,
              fai : resultColumn.fai,
              ecu : resultColumn.ecu,
              k1 : resultColumn.k1,
              k2 : resultColumn.k2,
              n : resultColumn.n,
              k3 : resultColumn.k3,
              k4 : resultColumn.k4,
              Wd : resultColumn.Wd,
              Wlim : resultColumn.Wlim,

              ri : resultColumn.ri,
              ratio : resultColumn.ratio,
              result : resultColumn.result,

              /////////////// 総括表用 ///////////////
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

  // 計算と印刷用
  public getResultString(re: any): any {
    const result = {
      con: { alien: "center", value: "-" },

      Mhd: { alien: "center", value: "-" },
      Nhd: { alien: "center", value: "-" },
      sigma_b: { alien: "center", value: "-" },

      Md: { alien: "center", value: "-" },
      Nd: { alien: "center", value: "-" },
      sigma_c: { alien: "center", value: "-" },
      sigma_s: { alien: "center", value: "-" },

      Mpd: { alien: "center", value: "-" },
      Npd: { alien: "center", value: "-" },
      EsEc: { alien: "center", value: "-" },
      sigma_se: { alien: "center", value: "-" },
      c: { alien: "center", value: "-" },
      Cs: { alien: "center", value: "-" },
      fai: { alien: "center", value: "-" },

      ecu: { alien: "center", value: "-" },
      k1: { alien: "center", value: "-" },
      k2: { alien: "center", value: "-" },
      n: { alien: "center", value: "-" },
      k3: { alien: "center", value: "-" },
      k4: { alien: "center", value: "-" },

      Wd: { alien: "center", value: "-" },
      Wlim: { alien: "center", value: "-" },

      ri: { alien: "center", value: "-" },
      ratio: { alien: "center", value: "-" },
      result: { alien: "center", value: "-" },
    };

    // 環境条件
    if ("con" in re) {
      result.con.value = re.con;
    }

    // 永久作用
    if ("Md" in re) {
      result.Md = { alien: "right", value: (Math.round(re.Md*10)/10).toFixed(1) };
    }
    if ("Nd" in re) {
      result.Nd = { alien: "right", value: (Math.round(re.Nd*10)/10).toFixed(1) };
    }

    // 圧縮応力度の照査
    if ("Sigmac" in re && "fcd04" in re) {
      if (re.Sigmac < re.fcd04) {
        result.sigma_c.value =
          re.Sigmac.toFixed(2) + " < " + re.fcd04.toFixed(1);
      } else {
        result.sigma_c.value =
          re.Sigmac.toFixed(2) + " > " + re.fcd04.toFixed(1);
        result.result.value = "(0.4fcd) NG";
      }
    }

    // 縁応力の照査
    if ("Mhd" in re) {
      result.Mhd = { alien: "right", value: (Math.round(re.Mhd*10)/10).toFixed(1) };
    }
    if ("Nhd" in re) {
      result.Nhd = { alien: "right", value: (Math.round(re.Nhd*10)/10).toFixed(1) };
    }
    // 縁応力度
    if ("Sigmab" in re && "Sigmabl" in re) {
      if (re.Sigmab < re.Sigmabl) {
        let SigmabVal: number = re.Sigmab;
        if (SigmabVal < 0) {
          SigmabVal = 0;
        }
        result.sigma_b.value =
          SigmabVal.toFixed(2) + " < " + re.Sigmabl.toFixed(2);

        // 鉄筋応力度の照査
        if ("Sigmas" in re && "sigmal1" in re) {
          if (re.Sigmas < 0) {
            result.sigma_s.value = "全断面圧縮";
            if (result.result.value === "-") {
              result.result.value = "OK";
            }
          } else if (re.Sigmas < re.sigmal1) {
            result.sigma_s.value =
              re.Sigmas.toFixed(1) + " < " + re.sigmal1.toFixed(1);
            if (result.result.value === "-") {
              result.result.value = "OK";
            }
          } else {
            result.sigma_s.value =
              re.Sigmas.toFixed(1) + " > " + re.sigmal1.toFixed(1);
            result.result.value = "NG";
          }
        }
        return result;
      } else {
        result.sigma_b.value =
          re.Sigmab.toFixed(2) + " > " + re.Sigmabl.toFixed(2);
      }
    }

    // ひび割れ幅の照査
    if ("Mpd" in re) {
      result.Mpd = { alien: "right", value: (Math.round(re.Mpd*10)/10).toFixed(1) };
    }
    if ("Npd" in re) {
      result.Npd = { alien: "right", value: (Math.round(re.Npd*10)/10).toFixed(1) };
    }
    if ("EsEc" in re) {
      result.EsEc = { alien: "right", value: re.EsEc.toFixed(2) };
    }

    if ("sigma_se" in re) {
      result.sigma_se = { alien: "right", value: re.sigma_se.toFixed(1) };
    }
    if ("c" in re) {
      result.c = { alien: "right", value: re.c.toFixed(1) };
    }
    if ("Cs" in re) {
      result.Cs = { alien: "right", value: re.Cs.toFixed(1) };
    }
    if ("fai" in re) {
      result.fai = { alien: "right", value: re.fai.toFixed(0) };
    }
    if ("ecu" in re) {
      result.ecu = { alien: "right", value: re.ecu.toFixed(0) };
    }

    if ("k1" in re) {
      result.k1 = { alien: "right", value: re.k1.toFixed(2) };
    }
    if ("k2" in re) {
      result.k2 = { alien: "right", value: re.k2.toFixed(3) };
    }
    if ("n" in re) {
      result.n = { alien: "right", value: re.n.toFixed(3) };
    }
    if ("k3" in re) {
      result.k3 = { alien: "right", value: re.k3.toFixed(3) };
    }
    if ("k4" in re) {
      result.k4 = { alien: "right", value: re.k4.toFixed(2) };
    }
    if ("Wd" in re) {
      result.Wd = { alien: "right", value: re.Wd.toFixed(3) };
    }
    // 制限値
    if ("Wlim" in re) {
      result.Wlim = { alien: "right", value: re.Wlim.toFixed(3) };
    }
    if ("ri" in re) {
      result.ri.value = re.ri.toFixed(2);
    }
    if ("ratio" in re) {
      result.ratio.value = re.ratio.toFixed(3);
    }

    if (re.ratio < 1) {
      if (result.result.value === "-") {
        result.result.value = "OK";
      }
    } else {
      result.result.value = "NG";
    }

    return result;
  }
}
