import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyFatigueShearForceService } from "./calc-safety-fatigue-shear-force.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { InputFatiguesService } from "src/app/components/fatigues/fatigues.service";
import { CalcSummaryTableService } from "../result-summary-table/calc-summary-table.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-result-safety-fatigue-shear-force",
  templateUrl: "./result-safety-fatigue-shear-force.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyFatigueShearForceComponent implements OnInit {
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyFatigueShearForcepages: any[] = new Array();
  public NA: number; // A列車の回数
  public NB: number; // B列車の回数
  private title = "安全性（疲労破壊）せん断力の照査結果";
  public page_index = 'ap_4';
  public isSRC: boolean = false;

  constructor(
    private calc: CalcSafetyFatigueShearForceService,
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
      this.summary.setSummaryTable("safetyFatigueShearForce");
      return;
    }

    // 計算結果を集計する
    try {
      this.safetyFatigueShearForcepages = this.setSafetyFatiguePages(postData);
      this.isFulfilled = true;
      this.calc.isEnable = true;
      this.summary.setSummaryTable("safetyFatigueShearForce", this.safetyFatigueShearForcepages);
    } catch (e) {
      this.err = e.toString();
      this.isFulfilled = false;
      this.summary.setSummaryTable("safetyFatigueShearForce");
    }
    this.isLoading = false;
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
        SRCFlag : false,
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);

      let SRCFlag = false;
      for (const m of groupe[ig]) {
        for (const position of m.positions) {
          const fatigueInfo = this.fatigue.getCalcData(position.index);
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.filter(
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
            const section = this.result.getSection("Vd", res[0], safety);
            const member = section.member;
            const shape = section.shape;
            const Ast = section.Ast;

            const titleColumn = this.result.getTitleString( section.member, position, side );
            const fck: any = this.helper.getFck(safety);

            const value = this.calc.calcFatigue(res, section, fck, safety, fatigueInfo);
            if(value.N === 0) continue;
            const resultColumn: any = this.getResultString(value );

            let fsy_steel: number;
            let fsd_steel: number;
            if (titleColumn.title3 === '下側引張'){
              fsy_steel = section.steel.fsy_lower.fsy;
              fsd_steel = section.steel.fsy_lower.fsd;
            } else {
              fsy_steel = section.steel.fsy_upper.fsy;
              fsd_steel = section.steel.fsy_upper.fsd;
            }
            let fwyd3: number = (section.steel.fsvy_Hweb.fvyd !== null) ? 
                                section.steel.fsvy_Hweb.fvyd :
                                section.steel.fsvy_Iweb.fvyd ;

            const column = {
            /////////////// タイトル ///////////////
            title1 : { alien: "center", value: titleColumn.title1 },
            title2 : { alien: "center", value: titleColumn.title2 },
            title3 :  { alien: "center", value: titleColumn.title3 },
            ///////////////// 形状 /////////////////
            B : this.result.alien(this.result.numStr(shape.B,1)),
            H : this.result.alien(this.result.numStr(shape.H,1)),
            ///////////////// 鉄骨情報 /////////////////
            steel_I_tension : this.result.alien(section.steel.I.upper_flange),
            steel_I_web : this.result.alien(section.steel.I.web),
            steel_I_compress : this.result.alien(section.steel.I.lower_flange),
            steel_H_tension : this.result.alien(section.steel.H.left_flange),
            steel_H_web : this.result.alien(section.steel.H.web),
            /////////////// 引張鉄筋 ///////////////
            tan : this.result.alien(( section.tan === 0 ) ? '-' : section.tan, "center"),
            Ast : this.result.alien(this.result.numStr(section.Ast.Ast), "center"),
            AstString : this.result.alien(section.Ast.AstString, "center"),
            dst : this.result.alien(this.result.numStr(section.Ast.dst, 1), "center"),
            tcos : this.result.alien(this.result.numStr((section.Ast.tension!==null)?section.Ast.tension.cos: 1, 3), "center"),
            /////////////// コンクリート情報 ///////////////
            fck : this.result.alien(fck.fck.toFixed(1), "center"),
            rc : this.result.alien(fck.rc.toFixed(2), "center"),
            fcd : this.result.alien(fck.fcd.toFixed(1), "center"),
            /////////////// 鉄筋強度情報 ///////////////
            fsy : this.result.alien(this.result.numStr(section.Ast.fsy, 1), "center"),
            rs : this.result.alien(section.Ast.rs.toFixed(2), "center"),
            fsd : this.result.alien(this.result.numStr(section.Ast.fsd, 1), "center"),
            fwud : this.result.alien(section.Aw.fwud, "center"),
            /////////////// 鉄骨情報 ///////////////
            fsy_steel : this.result.alien(this.result.numStr(fsy_steel, 1), 'center'),
            rs_steel : this.result.alien(section.steel.rs.toFixed(2), 'center'),
            fsd_steel : this.result.alien(this.result.numStr(fsd_steel, 1), 'center'),
            /////////////// 帯鉄筋情報 ///////////////
            Aw : resultColumn.Aw,
            AwString : resultColumn.AwString,
            fwyd : resultColumn.fwyd,
            deg : resultColumn.deg,
            Ss : resultColumn.Ss,
            /////////////// 折り曲げ鉄筋情報 ///////////////
            Asb : resultColumn.Asb,
            AsbString : resultColumn.AsbString,
            fwyd2 : resultColumn.fwyd2,
            deg2 : resultColumn.deg2,
            Ss2 : resultColumn.Ss2,
            /////////////// 鉄骨情報 ///////////////
            fwyd3 : this.result.alien(this.result.numStr(fwyd3, 0), 'center'),
            /////////////// 断面力 ///////////////
            Vpd : resultColumn.Vpd,
            Mpd : resultColumn.Mpd,
            Npd : resultColumn.Npd,

            Vrd : resultColumn.Vrd,
            Mrd : resultColumn.Mrd,
            Nrd : resultColumn.Nrd,

            fvcd : resultColumn.fvcd,
            rbc : resultColumn.rbc,
            Vcd : resultColumn.Vcd,

            kr : resultColumn.kr,

            sigma_min : resultColumn.sigma_min,
            sigma_rd : resultColumn.sigma_rd,
            sigma_r : resultColumn.sigma_rd,

            fsr200 : resultColumn.fsr200,
            ratio200 : resultColumn.ratio200,

            sigma_min2 : resultColumn.sigma_min2,
            sigma_rd2 : resultColumn.sigma_rd2,
            sigma_r2 : resultColumn.sigma_rd2,
            
            fsr2002 : resultColumn.fsr2002,
            ratio2002 : resultColumn.ratio2002,
            
            k : resultColumn.k,
            ar : resultColumn.ar,
            ar2 : resultColumn.ar2,
            N : resultColumn.N,

            NA : resultColumn.NA,
            NB : resultColumn.NB,

            SASC : resultColumn.SASC,
            SBSC : resultColumn.SBSC,

            r1 : resultColumn.r1,
            r12 : resultColumn.r12,
            r2 : resultColumn.r2,

            rs2 : resultColumn.rs,
            frd : resultColumn.frd,
            frd2 : resultColumn.frd2,

            rbs : resultColumn.rbs,
            ri : resultColumn.ri,
            ratio : resultColumn.ratio,
            result : resultColumn.result,
            ratio2 : resultColumn.ratio2,
            result2 : resultColumn.result2,

            /////////////// Flag用 ///////////////
            bendFlag : (resultColumn.Asb.value!=='-'),  //折り曲げ鉄筋の情報があればtrue、無ければfalse
            steelFlag: (fsy_steel !== null),// 鉄骨情報があればtrue
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
                SRCFlag = true
                this.isSRC = true
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

      Aw: { alien: "center", value: "-" },
      AwString: { alien: "center", value: "-" },
      fwyd: { alien: "center", value: "-" },
      deg: { alien: "center", value: "-" },
      Ss: { alien: "center", value: "-" },

      Asb: { alien: "center", value: "-" },
      AsbString: { alien: "center", value: "-" },
      fwyd2: { alien: "center", value: "-" },
      deg2: { alien: "center", value: "-" },
      Ss2: { alien: "center", value: "-" },

      Vpd: { alien: "center", value: "-" },
      Mpd: { alien: "center", value: "-" },
      Npd: { alien: "center", value: "-" },

      Vrd: { alien: "center", value: "-" },
      Mrd: { alien: "center", value: "-" },
      Nrd: { alien: "center", value: "-" },

      fvcd: { alien: "center", value: "-" },
      rbc: { alien: "center", value: "-" },
      Vcd: { alien: "center", value: "-" },

      kr: { alien: "center", value: "-" },

      sigma_min: { alien: "center", value: "-" },
      sigma_rd: { alien: "center", value: "-" },

      fsr200: { alien: "center", value: "-" },
      ratio200: { alien: "center", value: "-" },
      
      sigma_min2: { alien: "center", value: "-" },
      sigma_rd2: { alien: "center", value: "-" },

      fsr2002: { alien: "center", value: "-" },
      ratio2002: { alien: "center", value: "-" },

      k: { alien: "center", value: "-" },
      ar: { alien: "center", value: "-" },
      ar2: { alien: "center", value: "-" },
      N: { alien: "center", value: "-" },

      NA: { alien: "center", value: "-" },
      NB: { alien: "center", value: "-" },

      SASC: { alien: "center", value: "-" },
      SBSC: { alien: "center", value: "-" },

      r1: { alien: "center", value: "-" },
      r12: { alien: "center", value: "-" },
      r2: { alien: "center", value: "-" },

      rs: { alien: "center", value: "-" },
      frd: { alien: "center", value: "-" },
      frd2: { alien: "center", value: "-" },

      rbs: { alien: "center", value: "-" },
      ri: { alien: "center", value: "-" },
      ratio: { alien: "center", value: "-" },
      result: { alien: "center", value: "-" },
      ratio2: { alien: "center", value: "-" },
      result2: { alien: "center", value: "-" },
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
    //折り曲げ鉄筋
    if ("Asb" in re) {
      result.Asb = { alien: "right", value: re.Asb.toFixed(1) };
    }
    if ("AsbString" in re) {
      result.AsbString = { alien: "right", value: re.AsbString };
    }
    if ("fwyd2" in re) {
      result.fwyd2 = { alien: "right", value: re.fwyd2.toFixed(0) };
    }
    if ("deg2" in re) {
      result.deg2 = { alien: "right", value: re.deg2.toFixed(0) };
    }
    if ("Ss2" in re) {
      result.Ss2 = { alien: "right", value: re.Ss2.toFixed(0) };
    }

    // 断面力
    if ("Vpd" in re) {
      result.Vpd = { alien: "right", value: (Math.round(re.Vpd*10)/10).toFixed(1) };
    }
    if ("Mpd" in re) {
      result.Mpd = { alien: "right", value: (Math.round(re.Mpd*10)/10).toFixed(1) };
    }
    if ("Npd" in re) {
      result.Npd = { alien: "right", value: (Math.round(re.Npd*10)/10).toFixed(1) };
    }

    if ("Vrd" in re) {
      result.Vrd = { alien: "right", value: (Math.round(re.Vrd*10)/10).toFixed(1) };
    }
    if ("Mrd" in re) {
      result.Mrd = { alien: "right", value: (Math.round(re.Mrd*10)/10).toFixed(1) };
    }
    if ("Nrd" in re) {
      result.Nrd = { alien: "right", value: (Math.round(re.Nrd*10)/10).toFixed(1) };
    }

    // 耐力
    if ("fvcd" in re) {
      result.fvcd = { alien: "right", value: re.fvcd.toFixed(3) };
    }
    if ("rbc" in re) {
      result.rbc = { alien: "right", value: re.rbc.toFixed(2) };
    }
    if ("Vcd" in re) {
      result.Vcd = { alien: "right", value: re.Vcd.toFixed(1) };
    }
    if ("kr" in re) {
      result.kr = { alien: "right", value: re.kr.toFixed(1) };
    }

    if ("sigma_min" in re) {
      result.sigma_min = { alien: "right", value: re.sigma_min.toFixed(2) };
    }
    if ("sigma_rd" in re) {
      result.sigma_rd = { alien: "right", value: re.sigma_rd.toFixed(2) };
    }

    if ("fsr200" in re) {
      result.fsr200 = { alien: "right", value: re.fsr200.toFixed(2) };
    }
    if ("ratio200" in re) {
      result.ratio200.value = re.ratio200.toFixed(3).toString() + ((re.ratio200 < 1) ? ' < 1.00' : ' > 1.00')
    }

    if ("sigma_min2" in re) {
      result.sigma_min2 = { alien: "right", value: re.sigma_min2.toFixed(2) };
    }
    if ("sigma_rd2" in re) {
      result.sigma_rd2 = { alien: "right", value: re.sigma_rd2.toFixed(2) };
    }
    
    if ("fsr2002" in re) {
      result.fsr2002 = { alien: "right", value: re.fsr2002.toFixed(2) };
    }
    if ("ratio2002" in re) {
      result.ratio2002.value = re.ratio2002.toFixed(3).toString() + ((re.ratio2002 < 1) ? ' < 1.00' : ' > 1.00')
    }

    if ("k" in re) {
      result.k = { alien: "right", value: re.k.toFixed(2) };
    }
    if ("ar" in re) {
      result.ar = { alien: "right", value: re.ar.toFixed(3) };
    }
    if ("ar2" in re) {
      result.ar2 = { alien: "right", value: re.ar2.toFixed(3) };
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
    if ("r12" in re) {
      result.r12 = { alien: "right", value: re.r12.toFixed(2) };
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
    if ("frd2" in re) {
      result.frd2 = { alien: "right", value: re.frd2.toFixed(2) };
    }
    if ("rbs" in re) {
      result.rbs = { alien: "right", value: re.rbs.toFixed(2) };
    }
    if ("ri" in re) {
      result.ri = { alien: "right", value: re.ri.toFixed(2) };
    }
    let ratio = 0;
    if ("ratio" in re) {
      result.ratio.value = re.ratio.toFixed(3).toString() + ((re.ratio < 1) ? ' < 1.00' : ' > 1.00');
      ratio = re.ratio;
    }
    if (ratio < 1) {
      result.result.value = "OK";
    } else {
      result.result.value = "NG";
    }
    ratio = 0;
    if ("ratio2" in re) {
      result.ratio2.value = re.ratio2.toFixed(3).toString() + ((re.ratio2 < 1) ? ' < 1.00' : ' > 1.00');
      ratio = re.ratio2;
    }
    if (ratio < 1) {
      result.result2.value = "OK";
    } else {
      result.result2.value = "NG";
    }

    return result;
  }
}
