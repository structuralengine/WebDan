import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcServiceabilityShearForceService } from "./calc-serviceability-shear-force.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { ResultSafetyShearForceComponent } from "../result-safety-shear-force/result-safety-shear-force.component";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { SetBarService } from "../set-bar.service";
import { SetSectionService } from "../set-section.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";

@Component({
  selector: "app-result-serviceability-shear-force",
  templateUrl: "./result-serviceability-shear-force.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultServiceabilityShearForceComponent implements OnInit {
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public serviceabilityShearForcePages: any[] = new Array();
  private title = "耐久性 せん断ひび割れの照査結果";
  public page_index = "ap_6";

  constructor(
    private http: HttpClient,
    private calc: CalcServiceabilityShearForceService,
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
      this.summary.setSummaryTable("serviceabilityShearForce");
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
        this.summary.setSummaryTable("serviceabilityShearForce", this.serviceabilityShearForcePages);
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
        this.summary.setSummaryTable("serviceabilityShearForce");
      }
    );
  }

  // 計算結果を集計する
  private setPages(OutputData: any): boolean {
    try {
      this.serviceabilityShearForcePages = this.setServiceabilityPages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public setServiceabilityPages(OutputData: any): any[] {
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
            const titleColumn = this.result.getTitleString(
              member,
              position,
              side
            );
            const shape = this.section.getResult("Vd", member, res);
            const Ast: any = this.bar.getResult("Vd", shape, res, safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.getResultString(
              this.calc.calcSigma(
                res,
                shape,
                fck,
                Ast,
                safety)
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
            column.push(this.result.alien(( Ast.tan === 0 ) ? '-' : Ast.tan, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.Ast), "center"));
            column.push(this.result.alien(Ast.AstString, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.dst), "center"));
            /////////////// 圧縮鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Asc), "center"));
            column.push(this.result.alien(Ast.AscString, "center"));
            column.push(this.result.alien(this.result.numStr(Ast.dsc), "center"));
            /////////////// 側面鉄筋 ///////////////
            // column.push(this.result.alien(this.result.numStr(Ast.Ase), 'center'));
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
            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.Aw);
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Nd);
            column.push(resultColumn.Vhd);
            column.push(resultColumn.Vpd);
            column.push(resultColumn.Vrd);
            /////////////// せん断耐力 ///////////////
            column.push(resultColumn.fvcd);
            column.push(resultColumn.Bd);
            column.push(resultColumn.pc);
            column.push(resultColumn.Bp);
            column.push(resultColumn.Mu);
            column.push(resultColumn.Mo);
            column.push(resultColumn.Bn);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);
            column.push(resultColumn.Vcd07);
            /////////////// せん断応力度 ///////////////
            column.push(resultColumn.con);
            column.push(resultColumn.kr);
            column.push(resultColumn.ri);
            column.push(resultColumn.sigma);
            column.push(resultColumn.Ratio);
            column.push(resultColumn.Result);

            /////////////// 総括表用 ///////////////
            column.push(position.index);
            column.push(side);
            column.push(shape.shape);
                        
            page.columns.push(column);
          }
        }
      }
      // 最後のページ
      if (page.columns.length > 0) {
        for(let i=page.columns.length; i<5; i++){
          const column: any[] = new Array();
          for(let j=0; j<page.columns[0].length-3; j++){
            column.push({alien: 'center', value: '-'});
          }
          column.push(null);//position.index);
          column.push(null);//side);
          column.push(null);//shape.shape);
          page.columns.push(column);
        }
        result.push(page);
      }
    }
    return result;
  }

  public getResultString(re: any): any {
    const result = {

      Aw: { alien: "center", value: "-" },
      AwString: { alien: "center", value: "-" },
      fwyd: { alien: "center", value: "-" },
      deg: { alien: "center", value: "-" },
      Ss: { alien: "center", value: "-" },

      Nd: { alien: "center", value: "-" },
      Vhd: { alien: "center", value: "-" },
      Vpd: { alien: "center", value: "-" },
      Vrd: { alien: "center", value: "-" },

      fvcd: { alien: "center", value: "-" },
      Bd: { alien: "center", value: "-" },
      pc: { alien: "center", value: "-" },
      Bp: { alien: "center", value: "-" },
      Mu: { alien: "center", value: "-" },
      Mo: { alien: "center", value: "-" },
      Bn: { alien: "center", value: "-" },
      rbc: { alien: "center", value: "-" },
      Vcd: { alien: "center", value: "-" },
      Vcd07: { alien: "center", value: "-" },

      con: { alien: "center", value: "-" },
      kr: { alien: "center", value: "-" },
      ri: { alien: "center", value: "-" },

      sigma: { alien: "center", value: "-" },
      Ratio: { alien: "center", value: "-" },
      Result: { alien: "center", value: "-" },
    };

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

    // 断面力
    if ("Nd" in re) {
      result.Nd = { alien: "right", value: (Math.round(re.Nd*10)/10).toFixed(1) };
    }
    let Vhd: number = re.Vd;
    if ("Vhd" in re) {
      // tanθc + tanθt があるとき
      Vhd = (Math.round((re.Vd - re.Vhd)*10)/10);
      const sVd: string = Vhd.toFixed(1) + "(" + (Math.round(re.Vd*10)/10).toFixed(1) + ")";
      result.Vhd = { alien: "right", value: sVd };
    } else {
      result.Vhd = { alien: "right", value: (Math.round(Vhd*10)/10).toFixed(1) };
    }
    if ("Vpd" in re) {
      result.Vpd = { alien: "right", value: (Math.round(re.Vpd*10)/10).toFixed(1) };
    }
    if ("Vrd" in re) {
      result.Vrd = { alien: "right", value: (Math.round(re.Vrd*10)/10).toFixed(1) };
    }

    // 耐力
    if ("fvcd" in re) {
      result.fvcd = { alien: "right", value: re.fvcd.toFixed(3) };
    }
    if ("Bd" in re) {
      result.Bd = { alien: "right", value: re.Bd.toFixed(3) };
    }
    if ("pc" in re) {
      result.pc = { alien: "right", value: re.pc.toFixed(5) };
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
    if ("rbc" in re) {
      result.rbc = { alien: "right", value: re.rbc.toFixed(2) };
    }
    if ("Vcd" in re) {
      result.Vcd = { alien: "right", value: re.Vcd.toFixed(1) };
    }
    if ("Vcd07" in re) {
      if (Vhd <= re.Vcd07) {
        const str: string = Vhd.toFixed(1) + "<" + re.Vcd07.toFixed(1);
        result.Vcd07 = { alien: "center", value: str };
      } else {
        const str: string = Vhd.toFixed(1) + ">" + re.Vcd07.toFixed(1);
        result.Vcd07 = { alien: "center", value: str };
      }
    }

    if ("con" in re) {
      result.con = { alien: "center", value: re.con };
    }
    if ("kr" in re) {
      result.kr = { alien: "right", value: re.kr.toFixed(1) };
    }
    if ("ri" in re) {
      result.ri = { alien: "right", value: re.ri.toFixed(2) };
    }

    if ("sigmaw" in re && "sigma12" in re) {
      const str: string = re.sigmaw.toFixed(1) + "/" + re.sigma12.toFixed(0);
      result.sigma = { alien: "center", value: str };
    }

    if ("Ratio" in re) {
      result.Ratio = { alien: "right", value: re.Ratio.toFixed(3) };
    }
    if ("Result" in re) {
      result.Result = { alien: "center", value: re.Result };
    }

    return result;
  }
}
