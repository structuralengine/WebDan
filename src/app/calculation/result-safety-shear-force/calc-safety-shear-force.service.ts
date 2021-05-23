import { SaveDataService } from "../../providers/save-data.service";
import { SetDesignForceService } from "../set-design-force.service";
import { ResultDataService } from "../result-data.service";
import { SetPostDataService } from "../set-post-data.service";
import { SetBarService } from "../set-bar.service";

import { Injectable } from "@angular/core";
import { range } from "rxjs";
import { Data } from "@angular/router";
import { DataHelperModule } from "src/app/providers/data-helper.module";
import { InputCalclationPrintService } from "src/app/components/calculation-print/calculation-print.service";
import { InputBasicInformationService } from "src/app/components/basic-information/basic-information.service";
import { InputSafetyFactorsMaterialStrengthsService } from "src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { SetSectionService } from "../set-section.service";

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
    private bar: SetBarService,
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

    this.DesignForceList = this.force.getDesignForceList(
      "Vd",
      this.basic.pickup_shear_force_no(5)
    );
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
    return this.safety.getCalcData("Vd", g_id, this.safetyID);
  }

  // 変数の整理と計算
  public calcVmu(
    res: any,
    shape: any,
    fc: any,
    Ast: any,
    safety: any,
    member: any,
    La: number,
    DesignForceList: any
  ): any {
    const force = DesignForceList.find(
      (v) => v.index === res.index
    ).designForce.find((v) => v.side === res.side);

    const result: any = {}; // 印刷用

    // 断面力
    let Md: number = this.helper.toNumber(force.Md);
    if (Md === null) {
      Md = 0;
    }
    Md = Math.abs(Md);
    result["Md"] = Md;

    let Nd: number = this.helper.toNumber(force.Nd);
    if (Nd === null) {
      Nd = 0;
    }
    result["Nd"] = Nd;

    let Vd: number = Math.abs(this.helper.toNumber(force.Vd));
    if (Vd === null) {
      return result;
    }
    Vd = Math.abs(Vd);
    result["Vd"] = Vd;

    // 換算断面
    const VydBH = this.section.getVydBH(shape);
    const h: number = VydBH.H;
    result["H"] = h;

    const bw: number = VydBH.B;
    result["B"] = bw;

    // 有効高さ
    let d: number = 0;
    result["d"] = d;

    //  tanθc + tanθt
    let tan: number = 0;
    let Vhd: number = 0;
    if (tan !== 0) {
      Vhd = (Math.abs(Md) / d) * this.bar.Radians(tan);
      result["tan"] = tan;
      result["Vhd"] = Vhd;
    } else {
      result["tan"] = null;
      result["Vhd"] = null;
    }


    // せん断スパン
    if (La === null) {
      La = Number.MAX_VALUE;
    } else {
      if (La === 1) {
        La = Math.abs(Md / Vd) * 1000; // せん断スパン=1 は せん断スパンを自動で計算する
      }
      result["La"] = La;
    }

    // 引張鉄筋
    let Ass: number = 0;
    // 引張鉄筋比
    let pc: number = 0;


    // 帯鉄筋
    let Aw: number = 0;
      Aw = this.helper.toNumber(Ast.Aw);
      if (Aw === null) {
        Aw = 0;
      } else {
        result["Aw"] = Aw;
        result["AwString"] = Ast.AwString;
        result["fwyd"] = Ast.fwyd;
      }

    let fwyd: number = 0;
    fwyd = this.helper.toNumber(Ast.fwyd);
    if (fwyd === null) {
      fwyd = 0;
    } else {
      result["fwyd"] = fwyd;
    }

    let deg: number = 90;
    if ("deg" in Ast) {
      deg = this.helper.toNumber(Ast.deg);
      if (deg === null) {
        deg = 90;
      } else {
        result["deg"] = deg;
      }
    }

    let Ss: number = Number.MAX_VALUE;
    Ss = this.helper.toNumber(Ast.Ss);
    if (Ss === null) {
      Ss = Number.MAX_VALUE;
    } else {
      result["Ss"] = Ss;
    }

    // コンクリート材料
    let fck: number = 0;
      fck = this.helper.toNumber(Ast.fck);
      if (fck === null) {
        return result;
      }
    result["fck"] = fck;

    // 杭の施工条件による計数
    let rfck: number = 1;
      rfck = this.helper.toNumber(Ast.rfck);
      if (rfck === null) {
        rfck = 1;
      }

    let rVcd: number = 1;
    rVcd = this.helper.toNumber(Ast.rVcd);
    if (rVcd === null) {
      rVcd = 1;
    }

    let rc: number = this.helper.toNumber(Ast.rc);
    if (rc === null) {
      rc = 1;
    }
    result["rc"] = rc;

    const fcd = (rfck * fck) / rc;
    result["fcd"] = fcd;

    // 鉄筋材料
    let fsy: number = 0;
    fsy = this.helper.toNumber(Ast.fsy);
    if (fsy === null) {
      return result;
    }
    result["fsy"] = fsy;

    let rs: number = 0;
    rs = this.helper.toNumber(Ast.rs);
    if (rs === null) {
      rs = 1;
    }
    result["rs"] = rs;

    result["fsyd"] = fsy / rs;

    // 部材係数
    const Mu = res.M.Mi;
    result["Mu"] = Mu;

    // せん断耐力の照査
    let rbc: number = 1;
    if (La / d >= 2) {
      rbc = this.helper.toNumber(safety.rbc);
      if (rbc === null) {
        rbc = 1;
      }
      result["rbc"] = rbc;

      let rbs: number = 1;
      rbs = this.helper.toNumber(safety.rbs);
      if (rbs === null) {
        rbs = 1;
      }
      result["rbs"] = rbs;

      const Vyd: any = this.calcVyd(
        fcd, d, pc, Nd, H,
        Mu, B, rbc, rVcd, deg,
        Aw, fwyd, Ss, rbs);
      for (const key of Object.keys(Vyd)) {
        result[key] = Vyd[key];
      }
    } else {
      rbc = this.helper.toNumber(safety.rbd);
      if (rbc === null) {
        rbc = 1;
      }
      result["rbc"] = rbc;

      const Vdd: any = this.calcVdd(source);
      for (const key of Object.keys(Vdd)) {
        result[key] = Vdd[key];
      }
    }
    const Vwcd: any = this.calcVwcd(source);
    for (const key of Object.keys(Vwcd)) {
      result[key] = Vwcd[key];
    }

    let ri: number = 0;
    ri = this.helper.toNumber(safety.ri);
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
      Math.sin(this.bar.Radians(deg)) +
      Math.cos(this.bar.Radians(deg));
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
  private calcVwcd(source: any): any {
    const result = {};

    let fwcd: number = 1.25 * Math.sqrt(source.fcd);
    fwcd = Math.min(fwcd, 7.8);
    result["fwcd"] = fwcd;

    let Vwcd = (fwcd * source.B * source.d) / source.rbc;

    Vwcd = Vwcd / 1000;

    result["Vwcd"] = Vwcd;

    return result;
  }

  // 設計せん断圧縮破壊耐力 Vdd
  private calcVdd(source: any): any {
    const result = {};

    let fdd: number = 0.19 * Math.sqrt(source.fcd);
    result["fdd"] = fdd;

    let Bd: number = Math.pow(1000 / source.d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result["Bd"] = Bd;

    let pw: number = source.Aw / (source.B * source.Ss);
    result["pw"] = pw;
    if (pw < 0.002) {
      pw = 0;
    }

    //せん断スパン比
    let ad: number = source.La / source.d;
    result["ad"] = ad;

    let Bw: number =
      (4.2 * Math.pow(100 * pw, 1 / 3) * (ad - 0.75)) / Math.sqrt(source.fcd);
    Bw = Math.max(Bw, 0);
    result["Bw"] = Bw;

    //M0 = NDD / AC * iC / Y
    let Mo: number = (source.Nd * source.Height) / 6000;
    result["Mo"] = Mo;

    let Bn: number;
    if (source.Mu <= 0) {
      Bn = 1;
    } else if (source.Nd > 0) {
      Bn = 1 + (2 * Mo) / source.Mu;
      Bn = Math.min(Bn, 2);
    } else {
      Bn = 1 + (4 * Mo) / source.Mu;
      Bn = Math.max(Bn, 0);
    }
    result["Bn"] = Bn;

    let pc: number = source.pc;
    result["pc"] = pc;

    let Bp: number = (1 + Math.sqrt(100 * pc)) / 2;
    Bp = Math.min(Bp, 1.5);
    result["Bp"] = Bp;

    let Ba: number = 5 / (1 + Math.pow(ad, 2));
    result["Ba"] = Ba;

    let Vdd =
      ((Bd * Bn + Bw) * Bp * Ba * fdd * source.B * source.d) / source.rbc;

    Vdd = Vdd / 1000;

    result["Vdd"] = Vdd;

    return result;
  }
}
