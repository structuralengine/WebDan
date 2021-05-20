import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service'

import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';

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
    private calc: InputCalclationPrintService,
    private basic: InputBasicInformationService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
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

    // 複数の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList1);

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Md', '応力度', this.safetyID, this.DesignForceList, this.DesignForceList1);
    return postData;
  }


  public calcWd(PrintData: any, postdata0: any, postdata1: any, position: any, resultData: any,
                isDurability: boolean): any {

    const result = {};

    // 環境条件
    let conNum: number = 1;
    switch (PrintData.side) {
      case '上側引張':
        conNum = this.helper.toNumber(position.memberInfo.con_u);
        break;
      case '下側引張':
        conNum = this.helper.toNumber(position.memberInfo.con_l);
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

    let rc: number = 1;
    if ('rc' in PrintData) {
      rc = this.helper.toNumber(PrintData.rc);
      if (rc === null) { rc = 1; }
    }

    let fck: number;
    if ('fck' in PrintData) {
      fck = this.helper.toNumber(PrintData.fck);
      if (fck === null) { return result; }
    } else {
      return result;
    }

    let rfck: number = 1;
    if ('rfck' in PrintData) {
      rfck = this.helper.toNumber(PrintData.rfck);
      if (rfck === null) { rfck = 1; }
    }


    const fcd: number = rfck * fck / rc;


    let H: number;
    if ('H' in PrintData) {
      H = this.helper.toNumber(PrintData.H);
      if (H === null) { return result; }
    } else if ('R' in PrintData) {
      H = this.helper.toNumber(PrintData.R);
      if (H === null) { return result; }
    } else {
      return result;
    }

    // 永久作用
    let Md: number;
    if ('Md' in postdata0) {
      Md = this.helper.toNumber(postdata0.Md);
      if (Md !== null) {
        result['Md'] = Md;
      }
    }

    let Nd: number;
    if ('Nd' in postdata0) {
      Nd = this.helper.toNumber(postdata0.Nd);
      if (Nd !== null) {
        result['Nd'] = Nd;
      }
    }
    result['Nd'] = Nd;

    if (resultData === null) {
      resultData = {
        fi: 0,
        Md: 0,
        Nd: 0,
        sc: new Array(),
        st: new Array(),
        x: 0,
      };
    }

    // 圧縮応力度の照査
    const Sigmac: number = this.getSigmac(resultData.sc);
    if (Sigmac === null) { return result; }
    result['Sigmac'] = Sigmac;

    // 制限値
    const fcd04: number = 0.4 * fcd;
    result['fcd04'] = fcd04;

    // 縁応力の照査
    let Mhd: number;
    if ('Md' in postdata1) {
      Mhd = this.helper.toNumber(postdata1.Md);
      if (Mhd !== null) {
        result['Mhd'] = Mhd;
      }
    }

    let Nhd: number;
    if ('Nd' in postdata1) {
      Nhd = this.helper.toNumber(postdata1.Nd);
      if (Nhd !== null) {
        result['Nhd'] = Nhd;
      }
    }

    // 縁応力度
    const Sigmab: number = this.getSigmab(Mhd, Nhd, PrintData);
    if (Sigmab === null) { return result; }
    result['Sigmab'] = Sigmab;

    // 制限値
    let Vyd_H: number; // 円形の制限値を求める時は換算矩形で求める
    if ('Vyd_H' in PrintData) {
      Vyd_H = this.helper.toNumber(PrintData.Vyd_H);
      if (Vyd_H === null) { return Vyd_H = H; }
    } else {
      Vyd_H = H;
    }
    const Sigmabl: number = this.getSigmaBl(Vyd_H, fcd);
    result['Sigmabl'] = Sigmabl;

    if (Sigmab < Sigmabl) {
      // 鉄筋応力度の照査
      const Sigmas: number = this.getSigmas(resultData.st, postdata0.Steels);
      if (Sigmas === null) { return result; }
      result['Sigmas'] = Sigmas;
      result['sigmal1'] = sigmal1;
      return result;
    }

    // ひび割れ幅の照査
    result['Mpd'] = Md;
    result['Npd'] = Nd;

    let Es: number;
    if ('Es' in PrintData) {
      Es = this.helper.toNumber(PrintData.Es);
      if (Es === null) { return result; }
    } else {
      return result;
    }
    let Ec: number;
    if ('Ec' in PrintData) {
      Ec = this.helper.toNumber(PrintData.Ec);
      if (Ec !== null) {
        result['EsEc'] = Es / Ec;
      }
    }

    const Sigmase: number = this.getSigmas(resultData.st, postdata0.Steels);
    if (Sigmase === null) { return result; }
    result['sigma_se'] = Sigmase;

    let c: number;
    if ('Ast-c' in PrintData) {
      c = this.helper.toNumber(PrintData['Ast-c']);
      if (c === null) { return result; }
    } else {
      return result;
    }
    result['c'] = c;

    let Cs: number;
    if ('Ast-Cs' in PrintData) {
      Cs = this.helper.toNumber(PrintData['Ast-Cs']);
      if (Cs === null) { return result; }
    } else {
      return result;
    }
    result['Cs'] = Cs;

    let fai: number;
    if ('Ast-φ' in PrintData) {
      fai = this.helper.toNumber(PrintData['Ast-φ']);
      if (fai === null) { return result; }
    } else {
      return result;
    }
    result['fai'] = fai;

    let ecu: number;
    if ('ecsd' in position.memberInfo) {
      ecu = this.helper.toNumber(position.memberInfo.ecsd);
      if (ecu === null) { ecu = 450; }
    } else {
      ecu = 450;
    }
    result['ecu'] = ecu;

    let k1: number = 1;
    if ('fsy' in PrintData) {
      const fsy: number = this.helper.toNumber(PrintData.fsy);
      if (fsy === 235) {
        k1 = 1.3;
      }
    }
    result['k1'] = k1;

    const k2: number = 15 / (fcd + 20) + 0.7;
    result['k2'] = k2;

    const n: number = PrintData['Ast-n'];
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

    let ri: number = 1;
    if ('ri' in PrintData) {
      ri = this.helper.toNumber(PrintData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    const ratio: number = ri * Wd / Wlim;
    result['ratio'] = ratio;

    return result;
  }


  // 鉄筋の引張応力度を返す　(引張応力度がプラス+, 圧縮応力度がマイナス-)
  public getSigmas(sigmaSt: any[], Steels: any[]): number {

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
  private getSigmab(Mhd: number, Nhd: number, PrintData: any): number {
    try {
      const I: number = PrintData.I;
      const A: number = PrintData.A;
      const Md: number = Math.abs(Mhd * 1000000);
      const Nd: number = Nhd * 1000;
      let e: number;
      switch (PrintData.side) {
        case '上側引張':
          e = PrintData.eu;
          break;
        case '下側引張':
          e = PrintData.el;
          break;
      }
      const Z = I / e;
      const result = Md / Z - Nd / A;
      return result;
    } catch{
      return null;
    }

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
