import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetFatigueService } from '../set-fatigue.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';

import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueMomentService {
  // 安全性（疲労破壊）曲げモーメント
  public DesignForceList: any[];
  // 永久作用と縁応力検討用のポストデータの数を調べるのに使う
  private PostedData: any;

  constructor(private save: SaveDataService,
    private force: SetDesignForceService,
    private fatigue: SetFatigueService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcServiceabilityMomentService
  ) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return new Array();
    }
    // 最小応力
    const DesignForce0 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[2]);
    // 最大応力
    const DesignForce1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[3]);

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

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return null;
    }
    // 最小応力
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[2]);
    // 最大応力
    const DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[3]);

    if (DesignForceList1.length < 1 || this.DesignForceList.length < 1) {
      return null;
    }

    // 変動応力
    const DesignForceList2 = this.getLiveload(this.DesignForceList, DesignForceList1);

    // サーバーに送信するデータを作成
    const DesignForceListList = [this.DesignForceList, DesignForceList2];
    this.post.setPostData(DesignForceListList);
    // POST 用
    this.PostedData = this.post.getPostData(this.DesignForceList, 1, 'Moment', '応力度', DesignForceListList.length);
    // 連結する
    const postData = {
      InputData0: this.copyInputData(this.PostedData.InputData0, this.PostedData.InputData1)
    };
    return postData;
  }

  // POST データを結合する
  private copyInputData(InputData0: any[], InputData1: any[]): any[] {
    for (let i = 0; i < InputData0.length; i++) {
      for (const key of Object.keys(InputData0[i])) {
        if (key in InputData1[i] === false) {
          InputData1[i][key] = InputData0[i][key];
        }
      }
    }
    const result = InputData0.concat(InputData1);
    return result;
  }

  // 変動荷重を
  public getLiveload(minDesignForceList: any[], maxDesignForceList: any[]): any[] {

    const result = JSON.parse(
      JSON.stringify({
        temp: maxDesignForceList
      })
    ).temp;

    for (let ig = 0; ig < minDesignForceList.length; ig++) {
      const groupe = minDesignForceList[ig];
      for (let im = 0; im < groupe.length; im++) {
        const member = groupe[im];
        for (let ip = 0; ip < member.positions.length; ip++) {
          const position = member.positions[ip];
          // position に 疲労係数入れる
          this.fatigue.setFatigueData(member.g_no, member.m_no, position);
          // 最大応力 - 最小応力 で変動荷重を求める
          const minForce: any = position.designForce;
          const maxForce: any = result[ig][im].positions[ip].designForce;
          for (let i = 0; i < minForce.length; i++) {
            for (const key1 of Object.keys(minForce[i])) {
              if (key1 === 'n') { continue; }
              for (const key2 of Object.keys(minForce[i][key1])) {
                if (key2 === 'comb') { continue; }
                maxForce[i][key1][key2] -= minForce[i][key1][key2];
              }
            }
          }
        }
      }
    }
    return result;
  }

  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    let groupeName: string;
    let i: number = 0;
    const title: string = '安全性（疲労破壊）曲げモーメントの照査結果';

    const responseMin = responseData.slice(0, this.PostedData.InputData0.length);
    const responseMax = responseData.slice(-this.PostedData.InputData1.length);

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 最小応力
            const postdata0 = position.PostData0[j];
            // 変動応力
            const postdata1 = position.PostData1[j];

            // 印刷用データ
            const printData = position.printData[j];

            // 応力度
            const resultMin = responseMin[i].ResultSigma;
            const resultMax = responseMax[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultFrd: any = this.calcFrd(printData, postdata0, postdata1, position, resultMin, resultMax);
            const resultColumn: any = this.getResultString(resultFrd);

            /////////////// タイトル /////////////// 
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata0));
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
            column.push(fsk.fsu);
            /////////////// 照査 ///////////////
            column.push(resultColumn.Mmin);
            column.push(resultColumn.Nmin);
            column.push(resultColumn.sigma_min);

            column.push(resultColumn.Mrd);
            column.push(resultColumn.Nrd);
            column.push(resultColumn.sigma_rd);

            column.push(resultColumn.fsr200);
            column.push(resultColumn.ratio200);

            column.push(resultColumn.k);
            column.push(resultColumn.ar);
            column.push(resultColumn.N);

            column.push(resultColumn.NA);
            column.push(resultColumn.NB);

            column.push(resultColumn.SASC);
            column.push(resultColumn.SBSC);

            column.push(resultColumn.r1);
            column.push(resultColumn.r2);

            column.push(resultColumn.rs);
            column.push(resultColumn.frd);

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

  private calcFrd(printData: any, postdata0: any, postdata1: any, position: any, responseMin: any, responseMax: any): any {

    const result: any = {};

    if (responseMin === null) {
      responseMin = {
        fi: 0,
        Md: 0,
        Nd: 0,
        sc: new Array(),
        st: new Array(),
        x: 0,
      }
    }

    let Mmin: number = 0;
    if ('Md' in postdata0) {
      Mmin = this.save.toNumber(postdata0.Md);
      if (Mmin !== null) {
        result['Mmin'] = Mmin;
      }
    }
    let Nmin: number = 0;
    if ('Nd' in postdata0) {
      Nmin = this.save.toNumber(postdata0.Nd);
      if (Nmin !== null) {
        result['Nmin'] = Nmin;
      }
    }

    const sigma_min: number = this.base.getSigmas(responseMin.st, postdata0.Steels);
    if (sigma_min === null) { return result; }
    result['sigma_min'] = sigma_min;

    if (responseMax === null) {
      responseMax = {
        fi: 0,
        Md: 0,
        Nd: 0,
        sc: new Array(),
        st: new Array(),
        x: 0,
      }
    }

    let Mrd: number = 0;
    if ('Md' in postdata1) {
      Mrd = this.save.toNumber(postdata1.Md);
      if (Mrd !== null) {
        result['Mrd'] = Mrd;
      }
    }
    let Nrd: number = 0;
    if ('Nd' in postdata1) {
      Nrd = this.save.toNumber(postdata1.Nd);
      if (Nrd !== null) {
        result['Nrd'] = Nrd;
      }
    }

    const sigma_rd: number = this.base.getSigmas(responseMax.st, postdata0.Steels);
    if (sigma_rd === null) { return result; }
    result['sigma_rd'] = sigma_rd;

    // f200 の計算
    let rs: number = 1.05;
    if ('rs' in printData) {
      rs = this.save.toNumber(printData.rs);
      if (rs === null) { rs = 1; }
    }
    result['rs'] = rs;

    let k: number = 0.12;

    let fai: number;
    if ('Wd-φ' in printData) {
      fai = this.save.toNumber(printData['Wd-φ']);
      if (fai === null) { return result; }
    } else {
      return result;
    }

    let fsu: number;
    if ('fsu' in printData) {
      fsu = this.save.toNumber(printData.fsu);
      if (fsu === null) { return result; }
    } else {
      return result;
    }

    let r1: number = 1;
    if ('r1_1' in position.memberInfo) {
      r1 = this.save.toNumber(position.memberInfo.r1_1);
      if (r1 === null) { r1 = 1; }
    }
    result['r1'] = r1;

    let ar: number = 3.09 - 0.003 * fai;

    let reference_count: number = this.save.toNumber(this.save.fatigues.reference_count);
    if(reference_count === null ){
      reference_count = 2000000;
    }
    const tmp201: number = Math.pow(10, ar) / Math.pow(reference_count, k);
    const tmp202: number = 1 - sigma_min / fsu;
    let fsr200: number = r1 * tmp201 * tmp202 / rs;
    result['fsr200'] = fsr200;

    let ri: number = 1;
    if ('ri' in printData) {
      ri = this.save.toNumber(printData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    let rb: number = 1;
    if ('rb' in position.safety_factor) {
      rb = this.save.toNumber(position.safety_factor.rb);
      if (rb === null) { rb = 1; }
    }

    const ratio200: number = ri * sigma_rd / (fsr200 / rb);
    result['ratio200'] = ratio200;

    if (ratio200 < 1) {
      k = 0.06;
      ar = 2.71 - 0.003 * fai;
    } else {
      k = 0.12;
      ar = 3.09 - 0.003 * fai;
    }
    
    // 標準列車荷重観山の総等価繰返し回数 N の計算
    let T: number;
    if ('service_life' in this.save.fatigues) {
      T = this.save.toNumber(this.save.fatigues.service_life);
      if (T === null) { return result; }
    } else {
      return result;
    }
    let jA: number = 0;
    if ('train_A_count' in this.save.fatigues) {
      jA = this.save.toNumber(this.save.fatigues.train_A_count);
      if (jA === null) { jA = 0; }
    }
    let jB: number = 0;
    if ('train_B_count' in this.save.fatigues) {
      jB = this.save.toNumber(this.save.fatigues.train_B_count);
      if (jB === null) { jB = 0; }
    }

    let inputFatigue: any;
    switch (printData.memo) {
      case '上側引張':
        inputFatigue = position.fatigueData.M1;
        break;
      case '下側引張':
        inputFatigue = position.fatigueData.M2;
        break;
    }
    let SASC: number = this.save.toNumber(inputFatigue.SA);
    if (SASC === null) {
      SASC = 1;
    } else {
      result['SASC'] = SASC;
    }
    let SBSC: number = this.save.toNumber(inputFatigue.SB);
    if (SBSC === null) {
      SBSC = 1;
    } else {
      result['SBSC'] = SBSC;
    }
    let a: number = this.save.toNumber(inputFatigue.A);
    if (a === null) {
      a = 1;
    } else {
      result['a'] = a;
    }
    let b: number = this.save.toNumber(inputFatigue.B);
    if (b === null) {
      b = 1;
    } else {
      result['b'] = b;
    }
    let NA: number = 0;
    let NB: number = 0;
    if (k === 0.06) {
      NA = this.save.toNumber(inputFatigue.NA06);
      NB = this.save.toNumber(inputFatigue.NB06);
    } else {
      NA = this.save.toNumber(inputFatigue.NA12);
      NB = this.save.toNumber(inputFatigue.NB12);
    }
    if (NA === null) {
      NA = 0;
    } else {
      result['NA'] = NA;
    }
    if (NB === null) {
      NB = 0;
    } else {
      result['NB'] = NB;
    }

    const tmpN1: number = 365 * T * jA * NA * Math.pow(SASC, 1 / k);
    const tmpN2: number = 365 * T * jB * NB * Math.pow(SBSC, 1 / k);
    const N: number = tmpN1 + tmpN2;
    result['N'] = N;

    if (ratio200 < 1 && N <= reference_count) {
      return result;
    }

    // frd の計算
    const tmpR21: number = Math.pow(a, 1 / k);
    const tmpR22: number = Math.pow(1 - a, 1 / k);
    const tmpR23: number = (tmpR21 + tmpR22) * ((1 - b) + b);
    const r2: number = Math.pow(1 / tmpR23, k);
    result['r2'] = r2;

    const tmpfrd1: number = Math.pow(10, ar) / Math.pow(N, k);
    const tmpfrd2: number = 1 - sigma_min / fsu;
    let frd: number = r1 * r2 * tmpfrd1 * tmpfrd2 / rs;
    result['frd'] = frd;

    const ratio: number = ri * sigma_rd / (frd / rb);
    result['ratio'] = ratio;

    return result;
  }

  private getResultString(re: any): any {

    const result: any = {
      Mmin: { alien: 'center', value: '-' },
      Nmin: { alien: 'center', value: '-' },
      sigma_min: { alien: 'center', value: '-' },

      Mrd: { alien: 'center', value: '-' },
      Nrd: { alien: 'center', value: '-' },
      sigma_rd: { alien: 'center', value: '-' },

      fsr200: { alien: 'center', value: '-' },
      ratio200: { alien: 'center', value: '-' },

      k: { alien: 'center', value: '-' },
      ar: { alien: 'center', value: '-' },
      N: { alien: 'center', value: '-' },

      NA: { alien: 'center', value: '-' },
      NB: { alien: 'center', value: '-' },

      SASC: { alien: 'center', value: '-' },
      SBSC: { alien: 'center', value: '-' },

      r1: { alien: 'center', value: '-' },
      r2: { alien: 'center', value: '-' },

      rs: { alien: 'center', value: '-' },
      frd: { alien: 'center', value: '-' },

      ri: { alien: 'center', value: '-' },
      ratio: { alien: 'center', value: '-' },
      result: { alien: 'center', value: '-' }
    };

    if ('Mmin' in re) {
      result.Mmin = { alien: 'right', value: re.Mmin.toFixed(1) };
    }
    if ('Nmin' in re) {
      result.Nmin = { alien: 'right', value: re.Nmin.toFixed(1) };
    }
    if ('sigma_min' in re) {
      result.sigma_min = { alien: 'right', value: re.sigma_min.toFixed(2) };
    }

    if ('Mrd' in re) {
      result.Mrd = { alien: 'right', value: re.Mrd.toFixed(1) };
    }
    if ('Nrd' in re) {
      result.Nrd = { alien: 'right', value: re.Nrd.toFixed(1) };
    }
    if ('sigma_rd' in re) {
      result.sigma_rd = { alien: 'right', value: re.sigma_rd.toFixed(2) };
    }

    if ('fsr200' in re) {
      result.fsr200 = { alien: 'right', value: re.fsr200.toFixed(2) };
    }
    if ('ratio200' in re) {
      result.ratio200.value = re.ratio200.toFixed(3);
    }

    if ('k' in re) {
      result.k = { alien: 'right', value: re.k.toFixed(2) };
    }
    if ('ar' in re) {
      result.ar = { alien: 'right', value: re.ar.toFixed(3) };
    }
    if ('N' in re) {
      result.N = { alien: 'right', value: re.N.toFixed() };
    }

    if ('NA' in re) {
      result.NA = { alien: 'right', value: re.NA.toFixed(2) };
    }
    if ('NB' in re) {
      result.NB = { alien: 'right', value: re.NB.toFixed(2) };
    }
    if ('SASC' in re) {
      result.SASC = { alien: 'right', value: re.SASC.toFixed(3) };
    }
    if ('SBSC' in re) {
      result.SBSC = { alien: 'right', value: re.SBSC.toFixed(3) };
    }
    if ('r1' in re) {
      result.r1 = { alien: 'right', value: re.r1.toFixed(2) };
    }
    if ('r2' in re) {
      result.r2 = { alien: 'right', value: re.r2.toFixed(3) };
    }
    if ('rs' in re) {
      result.rs = { alien: 'right', value: re.rs.toFixed(2) };
    }
    if ('frd' in re) {
      result.frd = { alien: 'right', value: re.frd.toFixed(2) };
    }
    if ('ri' in re) {
      result.ri = { alien: 'right', value: re.ri.toFixed(2) };
    }
    let ratio: number = 0;
    if ('ratio' in re) {
      result.ratio.value = re.ratio.toFixed(3);
      ratio = re.ratio;
    }
    if (ratio < 1) {
      result.result.value = 'OK';
    } else {
      result.result.value = 'NG';
    }

    return result;
  }

}
