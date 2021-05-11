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
  private DesignForceList1: any[];
  public isEnable: boolean;

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
    this.force.AlignMultipleLists(this.DesignForceList, this.DesignForceList1);

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData('Md', this.DesignForceList, this.DesignForceList1);

    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 0, 'Md', '応力度', 2);
    return postData;
  }

  // 出力テーブル用の配列にセット
  public setServiceabilityPages(responseData: any[], postData: any, title: string = null): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    let isDurability: boolean = false;
    if (title === null) {
      title = '耐久性　曲げひび割れの照査結果';
    } else {
      isDurability = true;
    }

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 永久荷重
            const postdata0 = position.PostData0[j];

            // 縁応力検討用荷重
            let postdata1 = { Md: 0, Nd: 0 };
            if ('PostData1' in position) {
              postdata1 = position.PostData1[j];
            }

            // 印刷用データ
            const PrintData = position.PrintData[j];

            // 応力度
            const resultData = responseData[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultWd: any = this.calcWd(PrintData, postdata0, postdata1, position, resultData, isDurability);
            const resultColumn: any = this.getResultString(resultWd);

            /////////////// タイトル /////////////// 
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata0));
            column.push(this.result.getTitleString3(position, postdata0));
            ///////////////// 形状 /////////////////
            column.push(this.result.getShapeString_B(PrintData));
            column.push(this.result.getShapeString_H(PrintData));
            column.push(this.result.getShapeString_Bt(PrintData));
            column.push(this.result.getShapeString_t(PrintData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(PrintData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(PrintData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(PrintData, 'Ase');
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
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
            i++;
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
  private getResultString(re: any): any {

    const result = {
      con: { alien: 'center', value: '-' },

      Mhd: { alien: 'center', value: '-' },
      Nhd: { alien: 'center', value: '-' },
      sigma_b: { alien: 'center', value: '-' },

      Md: { alien: 'center', value: '-' },
      Nd: { alien: 'center', value: '-' },
      sigma_c: { alien: 'center', value: '-' },
      sigma_s: { alien: 'center', value: '-' },

      Mpd: { alien: 'center', value: '-' },
      Npd: { alien: 'center', value: '-' },
      EsEc: { alien: 'center', value: '-' },
      sigma_se: { alien: 'center', value: '-' },
      c: { alien: 'center', value: '-' },
      Cs: { alien: 'center', value: '-' },
      fai: { alien: 'center', value: '-' },

      ecu: { alien: 'center', value: '-' },
      k1: { alien: 'center', value: '-' },
      k2: { alien: 'center', value: '-' },
      n: { alien: 'center', value: '-' },
      k3: { alien: 'center', value: '-' },
      k4: { alien: 'center', value: '-' },

      Wd: { alien: 'center', value: '-' },
      Wlim: { alien: 'center', value: '-' },

      ri: { alien: 'center', value: '-' },
      ratio: { alien: 'center', value: '-' },
      result: { alien: 'center', value: '-' }
    };

    // 環境条件
    if ('con' in re) {
      result.con.value = re.con;
    }

    // 永久作用
    if ('Md' in re) {
      result.Md = { alien: 'right', value: re.Md.toFixed(1) };
    }
    if ('Nd' in re) {
      result.Nd = { alien: 'right', value: re.Nd.toFixed(1) };
    }

    // 圧縮応力度の照査
    if ('Sigmac' in re && 'fcd04' in re) {
      if (re.Sigmac < re.fcd04) {
        result.sigma_c.value = re.Sigmac.toFixed(2) + ' < ' + re.fcd04.toFixed(1);
      } else {
        result.sigma_c.value = re.Sigmac.toFixed(2) + ' > ' + re.fcd04.toFixed(1);
        result.result.value = '(0.4fcd) NG';
      }
    }

    // 縁応力の照査
    if ('Mhd' in re) {
      result.Mhd = { alien: 'right', value: re.Mhd.toFixed(1) };
    }
    if ('Nhd' in re) {
      result.Nhd = { alien: 'right', value: re.Nhd.toFixed(1) };
    }
    // 縁応力度
    if ('Sigmab' in re && 'Sigmabl' in re) {
      if (re.Sigmab < re.Sigmabl) {
        let SigmabVal: number = re.Sigmab;
        if ( SigmabVal < 0 ) {
          SigmabVal = 0;
        }
        result.sigma_b.value = SigmabVal.toFixed(2) + ' < ' + re.Sigmabl.toFixed(2);

        // 鉄筋応力度の照査
        if ('Sigmas' in re && 'sigmal1' in re) {
          if (re.Sigmas < 0) {
            result.sigma_s.value = '全断面圧縮';
            if (result.result.value === '-') {
              result.result.value = 'OK';
            }
          } else if (re.Sigmas < re.sigmal1) {
            result.sigma_s.value = re.Sigmas.toFixed(1) + ' < ' + re.sigmal1.toFixed(1);
            if (result.result.value === '-') {
              result.result.value = 'OK';
            }
          } else {
            result.sigma_s.value = re.Sigmas.toFixed(1) + ' > ' + re.sigmal1.toFixed(1);
            result.result.value = 'NG';
          }
        }
        return result;
      } else {
        result.sigma_b.value = re.Sigmab.toFixed(2) + ' > ' + re.Sigmabl.toFixed(2);
      }
    }

    // ひび割れ幅の照査
    if ('Mpd' in re) {
      result.Mpd = { alien: 'right', value: re.Mpd.toFixed(1) };
    }
    if ('Npd' in re) {
      result.Npd = { alien: 'right', value: re.Npd.toFixed(1) };
    }
    if ('EsEc' in re) {
      result.EsEc = { alien: 'right', value: re.EsEc.toFixed(2) };
    }

    if ('sigma_se' in re) {
      result.sigma_se = { alien: 'right', value: re.sigma_se.toFixed(1) };
    }
    if ('c' in re) {
      result.c = { alien: 'right', value: re.c.toFixed(1) };
    }
    if ('Cs' in re) {
      result.Cs = { alien: 'right', value: re.Cs.toFixed(1) };
    }
    if ('fai' in re) {
      result.fai = { alien: 'right', value: re.fai.toFixed(0) };
    }
    if ('ecu' in re) {
      result.ecu = { alien: 'right', value: re.ecu.toFixed(0) };
    }

    if ('k1' in re) {
      result.k1 = { alien: 'right', value: re.k1.toFixed(2) };
    }
    if ('k2' in re) {
      result.k2 = { alien: 'right', value: re.k2.toFixed(3) };
    }
    if ('n' in re) {
      result.n = { alien: 'right', value: re.n.toFixed(3) };
    }
    if ('k3' in re) {
      result.k3 = { alien: 'right', value: re.k3.toFixed(3) };
    }
    if ('k4' in re) {
      result.k4 = { alien: 'right', value: re.k4.toFixed(2) };
    }
    if ('Wd' in re) {
      result.Wd = { alien: 'right', value: re.Wd.toFixed(3) };
    }
    // 制限値
    if ('Wlim' in re) {
      result.Wlim = { alien: 'right', value: re.Wlim.toFixed(3) };
    }
    if ('ri' in re) {
      result.ri.value = re.ri.toFixed(2);
    }
    if ('ratio' in re) {
      result.ratio.value = re.ratio.toFixed(3);
    }

    if (re.ratio < 1) {
      if (result.result.value === '-') {
        result.result.value = 'OK';
      }
    } else {
      result.result.value = 'NG';
    }

    return result;
  }

  public calcWd(PrintData: any, postdata0: any, postdata1: any, position: any, resultData: any,
                isDurability: boolean): any {

    const result = {};

    // 環境条件
    let conNum: number = 1;
    switch (PrintData.memo) {
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
      switch (PrintData.memo) {
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
