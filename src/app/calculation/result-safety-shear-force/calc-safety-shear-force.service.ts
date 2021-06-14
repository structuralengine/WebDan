import { SaveDataService } from "../../providers/save-data.service";
import { SetDesignForceService } from "../set-design-force.service";
import { ResultDataService } from "../result-data.service";
import { SetPostDataService } from "../set-post-data.service";
import { SectionInfoService } from "../shape-data/section-info.service";

import { Injectable } from "@angular/core";
import { range } from "rxjs";
import { Data } from "@angular/router";
import { DataHelperModule } from "src/app/providers/data-helper.module";
import { InputCalclationPrintService } from "src/app/components/calculation-print/calculation-print.service";
import { InputBasicInformationService } from "src/app/components/basic-information/basic-information.service";
import { InputSafetyFactorsMaterialStrengthsService } from "src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { SetSectionService } from "../shape-data/old-section.service";

@Injectable({
  providedIn: "root",
})
export class CalcSafetyShearForceService {
  // 安全性（破壊）せん断力
  public DesignForceList: any[];
  public isEnable: boolean;
  public safetyID: number = 2;

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private save: SaveDataService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private section: SetSectionService,
    private bar: SectionInfoService,
    private calc: InputCalclationPrintService,
    private basic: InputBasicInformationService
  ) {
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void {
    this.isEnable = false;

    this.DesignForceList = new Array();

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    const No5 = (this.save.isManual()) ? 5 : this.basic.pickup_shear_force_no(5);
    this.DesignForceList = this.force.getDesignForceList(
      "Vd",No5 );
  }

  // サーバー POST用データを生成する
  public setInputData(): any {
    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData(
      "Vd",
      "耐力",
      this.safetyID,
      this.DesignForceList
    );
    return postData;
  }

  public getSafetyFactor(g_id: any, safetyID: number) {
    return this.safety.getCalcData("Vd", g_id, safetyID);
  }

  // 変数の整理と計算
  public calcVmu(
    res: any,
    shape: any,
    fc: any,
    Ast: any,
    safety: any,
    Laa: number,
    force: any
  ): any {

    const result: any = {}; // 印刷用

    // 断面力
    let Md: number = this.helper.toNumber(force.Md);
    if (Md === null) {
      Md = 0;
    }
    Md = Math.abs(Md);
    if (Md !== 0) {
      result["Md"] = Md;
    }

    let Nd: number = this.helper.toNumber(force.Nd);
    if (Nd === null) {
      Nd = 0;
    }
    if (Nd !== 0) {
      result["Nd"] = Nd;
    }

    let Vd: number = Math.abs(this.helper.toNumber(force.Vd));
    if (Vd === null) {
      return result;
    }
    Vd = Math.abs(Vd);
    result["Vd"] = Vd;

    // 換算断面
    const h: number = shape.H;
    result["H"] = h;

    const bw: number = shape.B;
    result["B"] = bw;

    // 有効高さ
    const dsc = Ast.tension.dsc;
    let d: number = h - dsc;
    result["d"] = d;

    //  tanθc + tanθt
    const tan: number = Ast.tan;
    let Vhd: number = 0;
    if (tan !== 0) {
      Vhd = (Math.abs(Md) / d) * this.helper.Radians(tan);
      result["Vhd"] = Vhd;
    }

    // せん断スパン
    let La = this.helper.toNumber(Laa);
    if (La === null) {
      La = Number.MAX_VALUE;
    } else {
      if (La === 1) {
        La = Math.abs(Md / Vd) * 1000; // せん断スパン=1 は せん断スパンを自動で計算する
      }
      result["La"] = La;
    }

    // 引張鉄筋比
    let pc: number = Ast.Ast / (shape.B * d);

    // 帯鉄筋
    let Aw: number = this.helper.toNumber(Ast.Aw);
    let fwyd: number = this.helper.toNumber(Ast.fwyd);
    let deg: number = this.helper.toNumber(Ast.deg);
    if (deg === null) { deg = 90; }
    let Ss: number = this.helper.toNumber(Ast.Ss);
    if (Ss === null) { Ss = Number.MAX_VALUE; }
    if (Aw === null || fwyd === null) {
      Aw = 0;
      fwyd = 0;
    } else {
      result["Aw"] = Aw;
      result["AwString"] = Ast.AwString;
      result["fwyd"] = Ast.fwyd;
      result["deg"] = deg;
      result["Ss"] = Ss;
    }

    // コンクリート材料
    const fck: number = this.helper.toNumber(fc.fck);
    if (fck === null) {
      return result;
    }
    result["fck"] = fck;

    let rc: number = this.helper.toNumber(fc.rc);
    if (rc === null) {
      rc = 1;
    }
    result["rc"] = rc;

    let fcd: number = this.helper.toNumber(fc.fcd);
    if (fcd === null) {
      fcd = fck;
    }
    result["fcd"] = fcd;

    // 鉄筋材料
    let fsy: number = this.helper.toNumber(Ast.fsy);
    if (fsy !== null) {
      result["fsy"] = fsy;
    }


    let rs: number = this.helper.toNumber(Ast.rs);
    if (rs === null) {
      rs = 1;
    }
    result["rs"] = rs;

    result["fsyd"] = fsy / rs;

    let rVcd: number = this.helper.toNumber(fc.rVcd);;
    if (rVcd === null) {
      rVcd = 1;
    }

    // 部材係数
    const Mu = res.Reactions[0].M.Mi;
    result["Mu"] = Mu;

    // せん断耐力の照査
    let rbc: number = 1;
    if (La / d >= 2) {
      rbc = this.helper.toNumber(safety.safety_factor.rbc);
      if (rbc === null) {
        rbc = 1;
      }
      result["rbc"] = rbc;

      let rbs: number = 1;
      rbs = this.helper.toNumber(safety.safety_factor.rbs);
      if (rbs === null) {
        rbs = 1;
      }
      result["rbs"] = rbs;

      const Vyd: any = this.calcVyd(
        fcd, d, pc, Nd, h,
        Mu, bw, rbc, rVcd, deg,
        Aw, fwyd, Ss, rbs);
      for (const key of Object.keys(Vyd)) {
        result[key] = Vyd[key];
      }
    } else {
      rbc = this.helper.toNumber(safety.safety_factor.rbd);
      if (rbc === null) {
        rbc = 1;
      }
      result["rbc"] = rbc;

      const Vdd: any = this.calcVdd(
        fcd, d, Aw, bw, Ss,
        La, Nd, h, Mu, pc, rbc);
      for (const key of Object.keys(Vdd)) {
        result[key] = Vdd[key];
      }
    }
    const Vwcd: any = this.calcVwcd(fcd, bw, d, rbc);
    for (const key of Object.keys(Vwcd)) {
      result[key] = Vwcd[key];
    }

    let ri: number = 0;
    ri = this.helper.toNumber(safety.safety_factor.ri);
    if (ri === null) {
      ri = 1;
    }
    result["ri"] = ri;

    let Vyd_Ratio: number = 0;
    if ("Vyd" in result) {
      Vyd_Ratio = (ri * (result.Vd - Vhd)) / result.Vyd;
    } else if ("Vdd" in result) {
      Vyd_Ratio = (ri * (result.Vd - Vhd)) / result.Vdd;
    }
    result["Vyd_Ratio"] = Vyd_Ratio;

    let Vyd_Result: string = "NG";
    if (Vyd_Ratio < 1) {
      Vyd_Result = "OK";
    }
    result["Vyd_Result"] = Vyd_Result;

    let Vwcd_Ratio: number = 0;
    if ("Vwcd" in result) {
      Vwcd_Ratio = (ri * (result.Vd - Vhd)) / result.Vwcd;
    }
    result["Vwcd_Ratio"] = Vwcd_Ratio;

    let Vwcd_Result: string = "NG";
    if (Vwcd_Ratio < 1) {
      Vwcd_Result = "OK";
    }
    result["Vwcd_Result"] = Vwcd_Result;

    return result;
  }

  // 標準せん断耐力
  private calcVyd(
    fcd: number, d: number, pc: number, Nd: number, H: number,
    Mu: number, B: number, rbc: number, rVcd: number, deg: number,
    Aw: number, fwyd: number, Ss: number, rbs: number): any {
    const result = {};

    let fvcd: number = 0.2 * Math.pow(fcd, 1 / 3);
    fvcd = Math.min(fvcd, 0.72);
    result["fvcd"] = fvcd;

    let Bd: number = Math.pow(1000 / d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result["Bd"] = Bd;

    result["pc"] = pc;

    let Bp: number = Math.pow(100 * pc, 1 / 3);
    Bp = Math.min(Bp, 1.5);
    result["Bp"] = Bp;

    //M0 = NDD / AC * iC / Y
    let Mo: number = (Nd * H) / 6000;
    result["Mo"] = Mo;

    let Bn: number;
    if (Mu <= 0) {
      Bn = 1;
    } else if (Nd > 0) {
      Bn = 1 + (2 * Mo) / Mu;
      Bn = Math.min(Bn, 2);
    } else {
      Bn = 1 + (4 * Mo) / Mu;
      Bn = Math.max(Bn, 0);
    }
    result["Bn"] = Bn;

    let Vcd = (Bd * Bp * Bn * fvcd * B * d) / rbc;
    Vcd = Vcd / 1000;
    Vcd = Vcd * rVcd; // 杭の施工条件
    result["Vcd"] = Vcd;

    let z: number = d / 1.15;
    result["z"] = z;

    let sinCos: number =
      Math.sin(this.helper.Radians(deg)) +
      Math.cos(this.helper.Radians(deg));
    result["sinCos"] = sinCos;

    let Vsd =
      (((Aw * fwyd * sinCos) / Ss) * z) / rbs;

    Vsd = Vsd / 1000;

    result["Vsd"] = Vsd;

    const Vyd: number = Vcd + Vsd;

    result["Vyd"] = Vyd;

    return result;
  }

  // 腹部コンクリートの設計斜め圧縮破壊耐力
  private calcVwcd(fcd: number, B: number, d: number, rbc: number): any {
    const result = {};

    let fwcd: number = 1.25 * Math.sqrt(fcd);
    fwcd = Math.min(fwcd, 7.8);
    result["fwcd"] = fwcd;

    let Vwcd = (fwcd * B * d) / rbc;

    Vwcd = Vwcd / 1000;

    result["Vwcd"] = Vwcd;

    return result;
  }

  // 設計せん断圧縮破壊耐力 Vdd
  private calcVdd(fcd: number, d: number, Aw: number,
    B: number, Ss: number, La: number, Nd: number,
    Height: number, Mu: number, pc: number, rbc: number): any {
    const result = {};

    let fdd: number = 0.19 * Math.sqrt(fcd);
    result["fdd"] = fdd;

    let Bd: number = Math.pow(1000 / d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result["Bd"] = Bd;

    let pw: number = Aw / (B * Ss);
    result["pw"] = pw;
    if (pw < 0.002) {
      pw = 0;
    }

    //せん断スパン比
    let ad: number = La / d;
    result["ad"] = ad;

    let Bw: number =
      (4.2 * Math.pow(100 * pw, 1 / 3) * (ad - 0.75)) / Math.sqrt(fcd);
    Bw = Math.max(Bw, 0);
    result["Bw"] = Bw;

    //M0 = NDD / AC * iC / Y
    let Mo: number = (Nd * Height) / 6000;
    result["Mo"] = Mo;

    let Bn: number;
    if (Mu <= 0) {
      Bn = 1;
    } else if (Nd > 0) {
      Bn = 1 + (2 * Mo) / Mu;
      Bn = Math.min(Bn, 2);
    } else {
      Bn = 1 + (4 * Mo) / Mu;
      Bn = Math.max(Bn, 0);
    }
    result["Bn"] = Bn;

    result["pc"] = pc;

    let Bp: number = (1 + Math.sqrt(100 * pc)) / 2;
    Bp = Math.min(Bp, 1.5);
    result["Bp"] = Bp;

    let Ba: number = 5 / (1 + Math.pow(ad, 2));
    result["Ba"] = Ba;

    let Vdd =
      ((Bd * Bn + Bw) * Bp * Ba * fdd * B * d) / rbc;

    Vdd = Vdd / 1000;

    result["Vdd"] = Vdd;

    return result;
  }
}
