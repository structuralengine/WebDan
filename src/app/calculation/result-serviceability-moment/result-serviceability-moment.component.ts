import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcServiceabilityMomentService } from "./calc-serviceability-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { SetSectionService } from "../set-section.service";
import { SetBarService } from "../set-bar.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";

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
  public serviceabilityMomentPages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcServiceabilityMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private section: SetSectionService,
    private bar: SetBarService,
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
      this.summary.setSummaryTable("serviceabilityMoment", null);
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
        this.err = error.toString();
        this.isLoading = false;
        this.summary.setSummaryTable("serviceabilityMoment", null);
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

      for (const member of groupe[ig]) {
        for (const position of member.positions) {
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
            const titleColumn = this.result.getTitleString(
              member,
              position,
              side
            );
            const shape = this.section.getResult("Md", member, res[0]);
            const Ast: any = this.bar.getResult("Md", shape, res[0], safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcWd(
                res,
                shape,
                fck,
                Ast,
                safety,
                member,
                isDurability
              )
            );

            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push({ alien: "center", value: titleColumn.m_no });
            column.push({ alien: "center", value: titleColumn.p_name });
            column.push({ alien: "center", value: titleColumn.side });
            ///////////////// 形状 /////////////////
            column.push(this.result.alien(shape.B));
            column.push(this.result.alien(shape.H));
            column.push(this.result.alien(shape.Bt));
            column.push(this.result.alien(shape.t));
            /////////////// 引張鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ast), "center"));
            column.push(this.result.alien(Ast.AstString, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.dst), "center"));
            /////////////// 圧縮鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Asc), "center"));
            column.push(this.result.alien(Ast.AscString, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.dsc), "center"));
            /////////////// 側面鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ase), "center"));
            column.push(this.result.alien(Ast.AseString, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.dse), "center"));
            /////////////// コンクリート情報 ///////////////
            column.push(this.result.alien(fck.fck.toFixed(1), "center"));
            column.push(this.result.alien(fck.rc.toFixed(2), "center"));
            column.push(this.result.alien(fck.fcd.toFixed(1), "center"));
            /////////////// 鉄筋情報 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.fsy, 1), "center"));
            column.push(this.result.alien(Ast.rs.toFixed(2), "center"));
            column.push(this.result.alien(this.result.numStr(Ast.fsd, 1), "center"));
            /////////////// 照査 ///////////////
            column.push(resultColumn.con);

            column.push(resultColumn.Mhd);
            column.push(resultColumn.Nhd);
            column.push(resultColumn.sigma_b);

            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.sigma_c);
            column.push(resultColumn.sigma_s);

            column.push(resultColumn.Mpd);
            column.push(resultColumn.Npd);
            column.push(resultColumn.EsEc);
            column.push(resultColumn.sigma_se);
            column.push(resultColumn.c);
            column.push(resultColumn.Cs);
            column.push(resultColumn.fai);
            column.push(resultColumn.ecu);
            column.push(resultColumn.k1);
            column.push(resultColumn.k2);
            column.push(resultColumn.n);
            column.push(resultColumn.k3);
            column.push(resultColumn.k4);
            column.push(resultColumn.Wd);
            column.push(resultColumn.Wlim);

            column.push(resultColumn.ri);
            column.push(resultColumn.ratio);
            column.push(resultColumn.result);

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
      result.Md = { alien: "right", value: re.Md.toFixed(1) };
    }
    if ("Nd" in re) {
      result.Nd = { alien: "right", value: re.Nd.toFixed(1) };
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
      result.Mhd = { alien: "right", value: re.Mhd.toFixed(1) };
    }
    if ("Nhd" in re) {
      result.Nhd = { alien: "right", value: re.Nhd.toFixed(1) };
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
      result.Mpd = { alien: "right", value: re.Mpd.toFixed(1) };
    }
    if ("Npd" in re) {
      result.Npd = { alien: "right", value: re.Npd.toFixed(1) };
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
