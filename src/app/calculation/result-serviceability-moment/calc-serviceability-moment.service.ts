import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service'

import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';
import { InputCrackSettingsService } from 'src/app/components/crack/crack-settings.service';
import { SetSectionService } from '../set-section.service';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityMomentService {

  // 耐久性 曲げひび割れ
  public DesignForceList: any[];
  public DesignForceList1: any[];
  public isEnable: boolean;
  public safetyID: number = 0;

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private calc: InputCalclationPrintService,
    private basic: InputBasicInformationService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private crack: InputCrackSettingsService,
    private section: SetSectionService,
    public base: CalcSafetyMomentService) {
    this.DesignForceList = null;
    this.isEnable = false;
    }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void{

    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_moment_checked === false) {
      return;
    }

    // 永久荷重
    this.DesignForceList = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(1));
    // 縁応力度検討用
    this.DesignForceList1 = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(0));

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // 複数の断面力の整合性を確認する
    const force = this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList1);

    // POST 用
    const postData = this.post.setInputData('Md', '応力度', this.safetyID, force[0], force[1]);
    return postData;
  }

  public getSafetyFactor(g_id: any, safetyID: number) {
    return this.safety.getCalcData('Md', g_id, this.safetyID);
  }

  public calcWd(
    res: any, shape: any,
    fc: any, Ast: any, safety: any,
    member: any, isDurability: boolean): any {

    const res0 = res[0]; // 永久作用
    const res1 = res[1]; // 永久＋変動作用

    const crackInfo = this.crack.getTableColumn(res0.index);

    const result = {};

    // 環境条件
    let conNum: number = 1;
    switch (res0.side) {
      case '上側引張':
        conNum = this.helper.toNumber(crackInfo.con_u);
        break;
      case '下側引張':
        conNum = this.helper.toNumber(crackInfo.con_l);
        break;
    }
    if (conNum === null) { conNum = 1; }

    // 制限値
    let sigmal1: number = 140;
    let Wlim: number = 0.005;

    switch (conNum) {
      case 1:
        sigmal1 = 140;
        Wlim = 0.005;
        result['con'] = '一般の環境';
        break;
      case 2:
        sigmal1 = 120;
        Wlim = 0.004;
        result['con'] = '腐食性環境';
        break;
      case 3:
        sigmal1 = 100;
        Wlim = 0.0035;
        result['con'] = '厳しい腐食';
        break;
    }

    const fcd: number = fc.fcd;
    const H: number = shape.H;

    // 永久作用
    const Md: number = res0.ResultSigma.Md;
    result['Md'] = Md;

    const Nd: number = res0.ResultSigma.Nd;
    result['Nd'] = Nd;


    // 圧縮応力度の照査
    const Sigmac: number = this.getSigmac(res0.ResultSigma.sc);
    if (Sigmac === null) { return result; }
    result['Sigmac'] = Sigmac;

    // 制限値
    const fcd04: number = 0.4 * fcd;
    result['fcd04'] = fcd04;

    // 縁応力の照査
    const Mhd: number = res1.ResultSigma.Md;
    result['Mhd'] = Mhd;

    const Nhd: number = res1.ResultSigma.Nd;
    result['Nhd'] = Nhd;

    // 縁応力度
    const struct = this.section.getStructuralVal(
      shape.shape, member, "Md", res0.index);
    const Sigmab: number = this.getSigmab(Mhd, Nhd, res0.side, struct);
    if (Sigmab === null) { return result; }
    result['Sigmab'] = Sigmab;

    // 制限値
    // 円形の制限値を求める時は換算矩形で求める
    const VydBH = this.section.getShape(shape.shape, member,'Vd', res0.index)
    const Sigmabl: number = this.getSigmaBl(VydBH.H, fcd);
    result['Sigmabl'] = Sigmabl;

    const Sigmas: number = this.getSigmas(res0.ResultSigma.st);
    if (Sigmas === null) { return result; }

    if (Sigmab < Sigmabl) {
      // 鉄筋応力度の照査
      result['Sigmas'] = Sigmas;
      result['sigmal1'] = sigmal1;
      return result;
    }

    // ひび割れ幅の照査
    result['Mpd'] = Md;
    result['Npd'] = Nd;

    const Es: number = Ast.Es;
    const Ec: number = fc.Ec;
    result['EsEc'] = Es / Ec;

    const Sigmase: number = Sigmas;
    result['sigma_se'] = Sigmase;

    const fai: number = Ast.tension.rebar_dia;
    result['fai'] = fai;

    const c: number = Ast.tension.dsc - (Ast.tension.rebar_dia / 2)
    result['c'] = c;

    let Cs: number = Ast.tension.rebar_ss;
    result['Cs'] = Cs;

    let ecu: number = this.helper.toNumber(crackInfo.ecsd);
    if (ecu === null) { ecu = 450; }
    result['ecu'] = ecu;

    const k1: number = (Ast.fsy === 235) ? 1.3 : 1;
    result['k1'] = k1;

    const k2: number = 15 / (fcd + 20) + 0.7;
    result['k2'] = k2;

    const n: number = Ast.tension.n;
    result['n'] = n;

    const k3: number = (5 * (n + 2)) / (7 * n + 8);
    result['k3'] = k3;

    const k4: number = 0.85;
    result['k4'] = k4;

    const w1: number = 1.1 * k1 * k2 * k3 * k4;
    const w2: number = 4 * c + 0.7 * (Cs - fai);
    const w3: number = (Sigmase / (Es * 1000)) + (ecu / 1000000);
    const Wd: number = w1 * w2 * w3;
    result['Wd'] = Wd;

    // 制限値
    if (isDurability === false) {
      Wlim = Wlim * c;
    } else {
      Wlim = 0.3;
    }
    result['Wlim'] = Wlim;

    let ri: number = safety.safety_factor.ri;
    result['ri'] = ri;

    const ratio: number = ri * Wd / Wlim;
    result['ratio'] = ratio;

    return result;
  }


  // 鉄筋の引張応力度を返す　(引張応力度がプラス+, 圧縮応力度がマイナス-)
  public getSigmas(sigmaSt: any[]): number {

    if (sigmaSt === null) {
      return null;
    }
    if (sigmaSt.length < 1) {
      return 0;
    }

    try {
      // とりあえず最外縁の鉄筋の応力度を用いる
      let st: number = 0;
      let maxDepth: number = 0;
      for (const steel of sigmaSt) {
        if (maxDepth < steel.Depth) {
          st = steel.s;
          maxDepth = steel.Depth;
        }
      }
      return -st;
    } catch{
      return null;
    }
  }

  // コンクリートの圧縮応力度を返す　(圧縮応力度がプラス+, 引張応力度がマイナス-)
  private getSigmac(sigmaSc: any[]): number {

    if (sigmaSc === null) {
      return null;
    }
    if (sigmaSc.length < 1) {
      return 0;
    }

    let result: number = null;
    if (sigmaSc.length === 1) {
      result = sigmaSc[0].s;
    } else {
      const point1: any = sigmaSc[0];
      const point2: any = sigmaSc[1];
      const S: number = point1.s - point2.s;
      const DD: number = point2.Depth - point1.Depth;
      result = S / DD * point2.Depth + point2.s;
    }
    return result;

  }

  // 縁応力度を返す　(引張応力度がプラス+, 圧縮応力度がマイナス-)
  private getSigmab(Mhd: number, Nhd: number, side: string, struct: any): number {

    const I: number = struct.I;
    const A: number = struct.A;
    const Md: number = Math.abs(Mhd * 1000000);
    const Nd: number = Nhd * 1000;
    let e: number;
    switch (side) {
      case '上側引張':
        e = struct.eu;
        break;
      case '下側引張':
        e = struct.el;
        break;
    }
    const Z = I / e;
    const result = Md / Z - Nd / A;
    return result;

  }

  // 縁応力度の制限値を返す
  private getSigmaBl(H: number, ffck: number): number {

    const linear = (x, y) => {
      return ( x0: number ) => {
        const index = x.reduce((pre: any, current: number, i: any) => current <= x0 ? i : pre, 0); // 数値が何番目の配列の間かを探す
        const i = index === x.length - 1 ? x.length - 2 : index;                 // 配列の最後の値より大きい場合は、外挿のために、最後から2番目をindexにする
        return (y[i + 1] - y[i]) / (x[i + 1] - x[i]) * (x0 - x[i]) + y[i];       // 線形補間の関数を返す
      };
    };

    // コンクリート強度は 24以下はない
    let fck: number = ffck;
    if (ffck < 24) {　fck = 24; }
    if (ffck > 80) {  fck = 80; }

    const x0 = [24, 27, 30, 40, 50, 60, 80];
    const y025 = [3.9, 4.1, 4.4, 5.2, 5.8, 6.5, 7.6];
    const y050 = [2.9, 3.1, 3.3, 3.9, 4.5, 5.0, 5.9];
    const y100 = [2.2, 2.4, 2.6, 3.1, 3.5, 4.0, 4.7];
    const y200 = [1.8, 1.9, 2.1, 2.5, 2.9, 3.2, 3.9];

    // コンクリート強度の線形補間関数を作成
    let result: number = null;
    if (H > 2000) {
      const linear200 = linear(x0, y200);
      result = linear200(fck);

    } else {

      // 線形補間関数を作成
      let y: number[];
      const linear025 = linear(x0, y025);
      const linear050 = linear(x0, y050);
      const linear100 = linear(x0, y100);
      const linear200 = linear(x0, y200);
      y = [linear025(fck), linear050(fck), linear100(fck), linear200(fck)];

      // 断面高さの線形補間関数を作成
      const x = [250, 500, 1000, 2000];
      const linearH = linear(x, y);
      result = linearH(H);
    }

    return result;
  }


}
