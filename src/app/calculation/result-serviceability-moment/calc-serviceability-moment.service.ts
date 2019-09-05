import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service'

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityMomentService {
  // 耐久性 曲げひび割れ
  public DesignForceList: any[]; // 永久荷重
  private DesignForceList1: any[];  // 縁応力検討用


  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService,
              private result: ResultDataService,
              public base: CalcSafetyMomentService) {
    this.DesignForceList = null;
    this.DesignForceList1 = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return new Array();
    }
    // 永久荷重
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[1]);
    // 縁応力度検討用
    this.DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[0]);


    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    if (this.save.calc.print_selected.print_section_force_checked === false) {
      return result;
    }
    if (isPrintOut === false) {
      return result;
    }
    // ToDo: ここで、断面力テーブル用のデータを 変数 result に構築する

    return result;
  }

  // サーバー POST用データを生成する
  public getPostData(): any {

    // 断面力のエラーチェック
    this.setDesignForces(false);

    // サーバーに送信するデータを作成
    const DesignForceListList = [this.DesignForceList, this.DesignForceList1];
    this.post.setPostData(DesignForceListList);
    // POST 用
    const postData = this.post.getPostData(this.DesignForceList, 0, 'Moment', '応力度', DesignForceListList.length);
    return postData;
  }

  // 出力テーブル用の配列にセット
  public setServiceabilityPages(responseData: any[], postData: any, title: string = '耐久性　曲げひび割れの照査結果'): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 永久荷重
            const postdata = position.PostData0[j];

            // 縁応力検討用荷重
            let liveLoad = { Md: 0, Nd: 0 };
            if ('PostData1' in position) {
              liveLoad = position.PostData1[j];
            }

            // 印刷用データ
            const printData = position.printData[j];

            // 応力度
            const resultData = responseData[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultColumn: any = this.getResultString(printData, postdata, liveLoad, position, resultData);

            /////////////// タイトル /////////////// 
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position));
            ///////////////// 形状 /////////////////
            column.push(this.result.getShapeString_B(printData));
            column.push(this.result.getShapeString_H(printData));
            column.push(this.result.getShapeString_Bt(printData));
            column.push(this.result.getShapeString_t(printData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(printData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(printData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(printData, 'Ase');
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(printData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(printData);
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
  private getResultString(printData: any, postdata: any, liveLoad: any, position: any, resultData: any): any {

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
    let conNum: number = 1;
    switch (printData.memo) {
      case '上側引張':
        conNum = this.save.toNumber(position.memberInfo.con_u);
        break;
      case '下側引張':
        conNum = this.save.toNumber(position.memberInfo.con_l);
        break;
    }
    if (conNum === null) { conNum = 1; }

    // 制限値
    let sigmal1: number = 140;
    switch (conNum) {
      case 1:
        sigmal1 = 140;
        result.con.value = '一般の環境';
        break;
      case 2:
        sigmal1 = 120;
        result.con.value = '腐食性環境';
        break;
      case 3:
        sigmal1 = 100;
        result.con.value = '厳しい腐食';
        break;
    }

    const rc: number = printData.rc;
    const fck: number = printData.fck;
    const fcd: number = fck / rc;
    const H: number = printData.H;

    // 永久作用
    const Md: number = postdata.Md;
    const Nd: number = postdata.Nd;
    result.Md = { alien: 'right', value: Md.toFixed(1) };
    result.Nd = { alien: 'right', value: Nd.toFixed(1) };
    // 圧縮応力度の照査
    const Sigmac: number = this.getSigmac(resultData.sc);
    const fcd04: number = 0.4 * fcd;
    if (Sigmac < fcd04) {
      result.sigma_c.value = Sigmac.toFixed(1) + '<' + fcd04.toFixed(1);
    } else {
      result.sigma_c.value = Sigmac.toFixed(1) + '>' + fcd04.toFixed(1);
      result.result.value = 'NG';
    }

    // 縁応力の照査
    const Mhd: number = liveLoad.Md;
    const Nhd: number = liveLoad.Nd;
    result.Mhd = { alien: 'right', value: Mhd.toFixed(1) };
    result.Nhd = { alien: 'right', value: Nhd.toFixed(1) };
    // 縁応力度
    const Sigmab: number = this.getSigmab(Mhd, Nhd, printData);
    // 制限値
    const Sigmabl: number = this.getSigmaBl(H, fcd);

    if (Sigmab < Sigmabl) {
      result.sigma_b.value = Sigmab.toFixed(1) + '<' + Sigmabl.toFixed(1);
      // 鉄筋応力度の照査
      const Sigmas: number = this.getSigmas(resultData.st, postdata.Steels);
      if (Sigmas < sigmal1) {
        result.sigma_s.value = Sigmas.toFixed(1) + '<' + sigmal1.toFixed(1);
        if ( result.result.value === '-' ) {
          result.result.value = 'OK';
        }
      } else {
        result.sigma_s.value = Sigmas.toFixed(1) + '>' + sigmal1.toFixed(1);
        result.result.value = 'NG';
      }
      return result;
    } else {
      result.sigma_b.value = Sigmab.toFixed(1) + '>' + Sigmabl.toFixed(1);
    }
    // ひび割れ幅の照査
    result.Mpd = { alien: 'right', value: Md.toFixed(1) };
    result.Npd = { alien: 'right', value: Nd.toFixed(1) };

    const Ec: number = printData.Ec;
    const Es: number = printData.Es;
    result.EsEc =  { alien: 'right', value: (Es / Ec).toFixed(2) };

    const Sigmase: number = this.getSigmas(resultData.st, postdata.Steels);
    result.sigma_se = { alien: 'right', value: Sigmase.toFixed(1) };
    const c: number =  printData['Wd-c'];
    result.c = { alien: 'right', value: c.toFixed(1) };
    const Cs: number =  printData['Wd-Cs'];
    result.Cs = { alien: 'right', value: Cs.toFixed() };
    


    return result;
  }

  // 鉄筋の引張応力度を返す　(引張応力度がプラス+, 圧縮応力度がマイナス-)
  private getSigmas(sigmaSt: any[], Steels: any[]): number {
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
  }

  // コンクリートの圧縮応力度を返す　(圧縮応力度がプラス+, 引張応力度がマイナス-)
  private getSigmac(sigmaSc: any[]): number {

    const point1: any = sigmaSc[0];
    const point2: any = sigmaSc[1];
    const S: number = point1.s - point2.s;
    const DD: number = point2.Depth - point1.Depth;

    let result: number = S / DD * point2.Depth + point2.s;
    return result;
  }

  // 縁応力度を返す　(引張応力度がプラス+, 圧縮応力度がマイナス-)
  private getSigmab(Mhd: number, Nhd: number, printData: any): number {
    const I: number = printData.I;
    const A: number = printData.A;
    const Md: number = Math.abs(Mhd * 1000000);
    const Nd: number = Nhd * 1000;
    let e: number;
    switch (printData.memo) {
      case '上側引張':
        e = printData.eu;
        break;
      case '下側引張':
        e = printData.el;
        break;
    }
    const Z = I / e;
    const result = Md / Z - Nd / A;
    return result;
  }

  // 縁応力度の制限値を返す
  private getSigmaBl(H: number, fck: number): number {

    const linear = (x, y) => {
      return (x0) => {
        const index = x.reduce((pre, current, i) => current <= x0 ? i : pre, 0) //数値が何番目の配列の間かを探す
        const i = index === x.length - 1 ? x.length - 2 : index //配列の最後の値より大きい場合は、外挿のために、最後から2番目をindexにする

        return (y[i + 1] - y[i]) / (x[i + 1] - x[i]) * (x0 - x[i]) + y[i] //線形補間の関数を返す
      };
    };

    const x0 = [24, 27, 30, 40, 50, 60, 80];
    const y025 = [3.9, 4.1, 4.4, 5.2, 5.8, 6.5, 7.6];
    const y050 = [2.9, 3.1, 3.3, 3.9, 4.5, 5.0, 5.9];
    const y100 = [2.2, 2.4, 2.6, 3.1, 3.5, 4.0, 4.7];
    const y200 = [1.8, 1.9, 2.1, 2.5, 2.9, 3.2, 3.9];

    // コンクリート強度の線形補間関数を作成
    let y: number[];
    if (H > 2000) {
      y = y200;
    } else {
      //線形補間関数を作成
      const linear025 = linear(x0, y025);
      const linear050 = linear(x0, y050);
      const linear100 = linear(x0, y100);
      const linear200 = linear(x0, y200);
      y = [linear025(fck), linear050(fck), linear100(fck), linear200(fck)]
    }
    // 断面高さの線形補間関数を作成
    const x = [250, 500, 1000, 2000];
    const linearH = linear(x, y)

    return linearH(H);
  }


}
