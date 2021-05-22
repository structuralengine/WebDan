import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyShearForceService } from "./calc-safety-shear-force.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { SetSectionService } from "../set-section.service";
import { SetBarService } from "../set-bar.service";

@Component({
  selector: "app-result-safety-shear-force",
  templateUrl: "./result-safety-shear-force.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyShearForceComponent implements OnInit {
  public title: string = "安全性（破壊）";
  public page_index = "ap_2";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyShearForcePages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyShearForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private section: SetSectionService,
    private bar: SetBarService,
    private points: InputDesignPointsService
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
      this.safetyShearForcePages = this.getSafetyPages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public getSafetyPages(
    OutputData: any,
    title: string = "安全性（破壊）せん断力の照査結果",
    DesignForceList: any = this.calc.DesignForceList,
    safetyID: number = this.calc.safetyID
  ): any[] {
    const result: any[] = new Array();

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
        0;
        for (const position of member.positions) {
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
            const shape = this.section.getResult("Vd", member, res);
            const Ast: any = this.bar.getResult("Vd", shape, res, safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcVmu(
                res,
                shape,
                fck,
                Ast,
                safety,
                member,
                position.La,
                DesignForceList
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
            /////////////// 引張鉄筋 ///////////////
            column.push(this.result.alien(Ast.tan, "center"));
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
            /////////////// 鉄筋強度情報 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.fsy, 1), "center"));
            column.push(this.result.alien(Ast.rs.toFixed(2), "center"));
            column.push(this.result.alien(this.result.numStr(Ast.fsd, 1), "center"));
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
          }
        }
      }
      if (page.columns.length > 0) {
        result.push(page);
      }
    }
    return result;
  }

  public getResultString(re: any): any {
    const result = {
      tan: { alien: "center", value: "-" },

      As: { alien: "center", value: "-" },
      AsString: { alien: "center", value: "-" },
      dst: { alien: "center", value: "-" },

      Md: { alien: "center", value: "-" },
      Nd: { alien: "center", value: "-" },
      Vd: { alien: "center", value: "-" },
      La: { alien: "center", value: "-" },

      Aw: { alien: "center", value: "-" },
      AwString: { alien: "center", value: "-" },
      fwyd: { alien: "center", value: "-" },
      deg: { alien: "center", value: "-" },
      Ss: { alien: "center", value: "-" },

      fvcd: { alien: "center", value: "-" },
      Bd: { alien: "center", value: "-" },
      Bp: { alien: "center", value: "-" },
      Mu: { alien: "center", value: "-" },
      Mo: { alien: "center", value: "-" },
      Bn: { alien: "center", value: "-" },
      ad: { alien: "center", value: "-" },
      Ba: { alien: "center", value: "-" },
      pw: { alien: "center", value: "-" },
      Bw: { alien: "center", value: "-" },
      rbc: { alien: "center", value: "-" },
      Vcd: { alien: "center", value: "-" },
      rbs: { alien: "center", value: "-" },
      Vsd: { alien: "center", value: "-" },
      Vyd: { alien: "center", value: "-" },
      ri: { alien: "center", value: "-" },
      Vyd_Ratio: { alien: "center", value: "-" },
      Vyd_Result: { alien: "center", value: "-" },
      fwcd: { alien: "center", value: "-" },
      Vwcd: { alien: "center", value: "-" },
      Vwcd_Ratio: { alien: "center", value: "-" },
      Vwcd_Result: { alien: "center", value: "-" },
    };

    if ("tan" in re) {
      result.tan = { alien: "right", value: re.tan.toFixed(1) };
    }

    // 引張鉄筋
    if ("Ast" in re) {
      result.As = { alien: "right", value: re.Ast.toFixed(1) };
    }
    if ("AstString" in re) {
      result.AsString = { alien: "right", value: re.AstString };
    }
    if ("d" in re) {
      result.dst = { alien: "right", value: (re.H - re.d).toFixed(1) };
    }

    // 断面力
    if ("Md" in re) {
      result.Md = { alien: "right", value: re.Md.toFixed(1) };
    }
    if ("Nd" in re) {
      result.Nd = { alien: "right", value: re.Nd.toFixed(1) };
    }
    if ("Vhd" in re) {
      // tanθc + tanθt があるとき
      const sVd: string =
        (re.Vd - re.Vhd).toFixed(1) + "(" + re.Vd.toFixed(1) + ")";
      result.Vd = { alien: "right", value: sVd };
    } else {
      result.Vd = { alien: "right", value: re.Vd.toFixed(1) };
    }

    if ("La" in re) {
      result.La = { alien: "right", value: re.La.toFixed(0) };
    }

    // 帯鉄筋
    if ("Aw" in re) {
      result.Aw = { alien: "right", value: re.Aw.toFixed(1) };
    }
    if ("AwString" in re) {
      result.AwString = { alien: "right", value: re.AwString };
    }
    if ("fwyd" in re) {
      result.fwyd = { alien: "right", value: re.fwyd.toFixed(0) };
    }
    if ("deg" in re) {
      result.deg = { alien: "right", value: re.deg.toFixed(0) };
    }
    if ("Ss" in re) {
      result.Ss = { alien: "right", value: re.Ss.toFixed(0) };
    }

    if ("fvcd" in re) {
      result.fvcd = { alien: "right", value: re.fvcd.toFixed(3) };
    }
    if ("fdd" in re) {
      result.fvcd = { alien: "right", value: re.fdd.toFixed(3) };
    }

    if ("Bd" in re) {
      result.Bd = { alien: "right", value: re.Bd.toFixed(3) };
    }
    if ("Bp" in re) {
      result.Bp = { alien: "right", value: re.Bp.toFixed(3) };
    }
    if ("Mu" in re) {
      result.Mu = { alien: "right", value: re.Mu.toFixed(1) };
    }
    if ("Mo" in re) {
      result.Mo = { alien: "right", value: re.Mo.toFixed(1) };
    }
    if ("Bn" in re) {
      result.Bn = { alien: "right", value: re.Bn.toFixed(3) };
    }
    if ("ad" in re) {
      result.ad = { alien: "right", value: re.ad.toFixed(3) };
    }
    if ("Ba" in re) {
      result.Ba = { alien: "right", value: re.Ba.toFixed(3) };
    }
    if ("pw" in re) {
      result.pw = { alien: "right", value: re.pw.toFixed(5) };
    }
    if ("Bw" in re) {
      result.Bw = { alien: "right", value: re.Bw.toFixed(3) };
    }

    if ("rbc" in re) {
      result.rbc = { alien: "right", value: re.rbc.toFixed(2) };
    }

    if ("Vcd" in re) {
      result.Vcd = { alien: "right", value: re.Vcd.toFixed(1) };
    }
    if ("Vdd" in re) {
      result.Vcd = { alien: "right", value: re.Vdd.toFixed(1) };
    }

    if ("rbs" in re) {
      result.rbs = { alien: "right", value: re.rbs.toFixed(2) };
    }
    if ("Vsd" in re) {
      result.Vsd = { alien: "right", value: re.Vsd.toFixed(1) };
    }

    if ("Vyd" in re) {
      result.Vyd = { alien: "right", value: re.Vyd.toFixed(1) };
    }
    if ("Vdd" in re) {
      result.Vyd = { alien: "right", value: re.Vdd.toFixed(1) };
    }

    if ("ri" in re) {
      result.ri = { alien: "right", value: re.ri.toFixed(2) };
    }

    if ("Vyd_Ratio" in re) {
      result.Vyd_Ratio = { alien: "right", value: re.Vyd_Ratio.toFixed(3) };
    }
    if ("Vyd_Result" in re) {
      result.Vyd_Result = { alien: "center", value: re.Vyd_Result };
    }

    if ("fwcd" in re) {
      result.fwcd = { alien: "right", value: re.fwcd.toFixed(3) };
    }
    if ("Vwcd" in re) {
      result.Vwcd = { alien: "right", value: re.Vwcd.toFixed(1) };
    }
    if ("Vwcd_Ratio" in re) {
      result.Vwcd_Ratio = { alien: "right", value: re.Vwcd_Ratio.toFixed(3) };
    }
    if ("Vwcd_Result" in re) {
      result.Vwcd_Result = { alien: "center", value: re.Vwcd_Result };
    }

    return result;
  }
}
