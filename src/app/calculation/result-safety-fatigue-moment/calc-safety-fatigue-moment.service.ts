import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';

import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputFatiguesService } from 'src/app/components/fatigues/fatigues.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputMembersService } from 'src/app/components/members/members.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueMomentService {
  // 安全性（疲労破壊）曲げモーメント
  public DesignForceList: any[];  // 永久+変動作用
  public DesignForceList1: any[]; // 疲労現
  public DesignForceList2: any[]; // 変動応力
  public DesignForceList3: any[]; // 永久作用
  public isEnable: boolean;

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private fatigue: InputFatiguesService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcServiceabilityMomentService,
    private basic: InputBasicInformationService,
    private members: InputMembersService,
    private calc: InputCalclationPrintService) {
    this.DesignForceList = null;
    this.DesignForceList3 = null;
    this.isEnable = false;
  }

  // 列車本数を返す関数
  public getTrainCount(): number[] {
    const result = new Array(2);
    let jA = 0;
    if ('train_A_count' in this.fatigue) {
      jA = this.helper.toNumber(this.fatigue.train_A_count);
      if (jA === null) { jA = 0; }
    }
    let jB = 0;
    if ('train_B_count' in this.fatigue) {
      jB = this.helper.toNumber(this.fatigue.train_B_count);
      if (jB === null) { jB = 0; }
    }
    result[0] = jA;
    result[1] = jB;
    return result;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void {

    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_moment_checked === false) {
      return;
    }

    // 疲労現
    this.DesignForceList1 = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(2));
    // 永久作用
    this.DesignForceList3 = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(3));
    // 永久+変動作用
    this.DesignForceList = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(4));

    // 複数の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList1, this.DesignForceList3);

    // 変動応力
    this.DesignForceList2 = this.force.getLiveload(this.DesignForceList3, this.DesignForceList);

    // 有効な入力行以外は削除する
    this.deleteFatigueDisablePosition();
  }

  // 疲労破壊の照査の対象外の着目点を削除する
  private deleteFatigueDisablePosition() {

    for (let ip = this.DesignForceList.length - 1; ip >= 0; ip--) {
      const pos: any = this.DesignForceList[ip];

      const force0 = pos.designForce;
      const force1 = this.DesignForceList1[ip].designForce;
      const force2 = this.DesignForceList2[ip].designForce;
      const force3 = this.DesignForceList3[ip].designForce;

      const info = this.fatigue.getCalcData(pos.index);
      for (let i = force0.length - 1; i >= 0; i--) {
        // 疲労に用いる係数を取得する
        const fat = (force0[i].side==="上側引張" ) ? info.upper : info.bottom;
        // 係数に１つも有効な数値がなければ削除
        let enable = false;
        for(const k of Object.keys(fat)){
          if(fat[k] !== null){
            enable = true;
            break;
          }
        }
        if((enable === false) ||(force0[i].Md === 0)) {
          force0.splice(i, 1);
          force1.splice(i, 1);
          force2.splice(i, 1);
          force3.splice(i, 1);
        }else{
          force0['fatigue'] = fat;
        }
      }

      if (pos.designForce.length < 1) {
        this.DesignForceList.splice(ip, 1);
        this.DesignForceList1.splice(ip, 1);
        this.DesignForceList2.splice(ip, 1);
        this.DesignForceList3.splice(ip, 1);
      }
    }
  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    // 列車本数の入力がない場合は処理を抜ける
    if (this.helper.toNumber(this.fatigue.train_A_count) === null &&
      this.helper.toNumber(this.fatigue.train_B_count) === null) {
      return;
    }

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData( 'Md', '応力度', 1, this.DesignForceList, this.DesignForceList3);
    return postData;
  }


  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    let groupeName: string;
    let i = 0;
    const title = '安全性（疲労破壊）曲げモーメントの照査結果';

    //仮
    // const responseMax = responseData.slice(0, this.PostedData.length);
    // const responseMin = responseData.slice(-this.PostedData.length);
    const responseMax = responseData.slice(0, 2); // エラー回避仮コード
    const responseMin = responseData.slice(-2);   // エラー回避仮コード
    //仮END

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 最小応力
            const postdata0 = position.PostData1[j];
            // 変動応力
            const postdata1 = position.PostData0[j];

            // 印刷用データ
            const PrintData = position.PrintData[j];

            // 応力度
            const resultMin = responseMin[i].ResultSigma;
            const resultMax = responseMax[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultFrd: any = this.calcFrd(PrintData, postdata0, postdata1, position, resultMin, resultMax);
            const resultColumn: any = this.getResultString(resultFrd);

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
            column.push(fsk.fsu);
            /////////////// 照査 ///////////////
            column.push(resultColumn.Mdmin);
            column.push(resultColumn.Ndmin);
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

  private calcFrd(PrintData: any, postdata0: any, postdata1: any, position: any, responseMin: any, responseMax: any): any {

    const result: any = {};

    if (responseMin === null) {
      responseMin = {
        fi: 0,
        Md: 0,
        Nd: 0,
        sc: new Array(),
        st: new Array(),
        x: 0,
      };
    }

    let Mdmin = 0;
    if ('Md' in postdata0) {
      Mdmin = this.helper.toNumber(postdata0.Md);
      if (Mdmin !== null) {
        result['Mdmin'] = Mdmin;
      }
    }
    let Ndmin = 0;
    if ('Nd' in postdata0) {
      Ndmin = this.helper.toNumber(postdata0.Nd);
      if (Ndmin !== null) {
        result['Ndmin'] = Ndmin;
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
      };
    }

    let Mrd = 0;
    if ('Md' in postdata1) {
      Mrd = this.helper.toNumber(postdata1.Md);
      if (Mrd !== null) {
        result['Mrd'] = Mrd;
      }
    }
    let Nrd = 0;
    if ('Nd' in postdata1) {
      Nrd = this.helper.toNumber(postdata1.Nd);
      if (Nrd !== null) {
        result['Nrd'] = Nrd;
      }
    }

    const sigma_rd: number = this.base.getSigmas(responseMax.st, postdata0.Steels);
    if (sigma_rd === null) { return result; }
    result['sigma_rd'] = sigma_rd;

    // f200 の計算
    let rs = 1.05;
    if ('rs' in PrintData) {
      rs = this.helper.toNumber(PrintData.rs);
      if (rs === null) { rs = 1; }
    }
    result['rs'] = rs;

    let k = 0.12;

    let fai: number;
    if ('Ast-φ' in PrintData) {
      fai = this.helper.toNumber(PrintData['Ast-φ']);
      if (fai === null) { return result; }
    } else {
      return result;
    }

    let fsu: number;
    if ('fsu' in PrintData) {
      fsu = this.helper.toNumber(PrintData.fsu);
      if (fsu === null) { return result; }
    } else {
      return result;
    }

    let r1 = 1;
    if ('r1_1' in position.memberInfo) {
      r1 = this.helper.toNumber(position.memberInfo.r1_1);
      if (r1 === null) { r1 = 1; }
    }
    result['r1'] = r1;

    let ar: number = 3.09 - 0.003 * fai;

    let reference_count: number = this.helper.toNumber(this.fatigue.reference_count);
    if (reference_count === null) {
      reference_count = 2000000;
    }
    const tmp201: number = Math.pow(10, ar) / Math.pow(reference_count, k);
    const tmp202: number = 1 - sigma_min / fsu;
    const fsr200: number = r1 * tmp201 * tmp202 / rs;
    result['fsr200'] = fsr200;

    let ri = 1;
    if ('ri' in PrintData) {
      ri = this.helper.toNumber(PrintData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    let rb = 1;
    if ('rb' in position.safety_factor) {
      rb = this.helper.toNumber(position.safety_factor.rb);
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
    result['ar'] = ar;
    result['k'] = k;

    // 標準列車荷重観山の総等価繰返し回数 N の計算
    let T: number;
    if ('service_life' in this.fatigue) {
      T = this.helper.toNumber(this.fatigue.service_life);
      if (T === null) { return result; }
    } else {
      return result;
    }

    const j = this.getTrainCount();
    const jA = j[0];
    const jB = j[1];

    const tmpFatigue = this.fatigue.getCalcData(position.index);

    let inputFatigue: any;
    switch (PrintData.side) {
      case '上側引張':
        inputFatigue = tmpFatigue.upper;
        break;
      case '下側引張':
        inputFatigue = tmpFatigue.buttom;
        break;
    }
    let SASC: number = this.helper.toNumber(inputFatigue.SA);
    if (SASC === null) {
      SASC = 1;
    } else {
      result['SASC'] = SASC;
    }
    let SBSC: number = this.helper.toNumber(inputFatigue.SB);
    if (SBSC === null) {
      SBSC = 1;
    } else {
      result['SBSC'] = SBSC;
    }
    let a: number = this.helper.toNumber(inputFatigue.A);
    if (a === null) {
      a = 1;
    } else {
      result['a'] = a;
    }
    let b: number = this.helper.toNumber(inputFatigue.B);
    if (b === null) {
      b = 1;
    } else {
      result['b'] = b;
    }
    let NA = 0;
    let NB = 0;
    if (k === 0.06) {
      NA = this.helper.toNumber(inputFatigue.NA06);
      NB = this.helper.toNumber(inputFatigue.NB06);
    } else {
      NA = this.helper.toNumber(inputFatigue.NA12);
      NB = this.helper.toNumber(inputFatigue.NB12);
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
    result['N'] = Math.ceil(N / 100) * 100;

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
    const frd: number = r1 * r2 * tmpfrd1 * tmpfrd2 / rs;
    result['frd'] = frd;

    const ratio: number = ri * sigma_rd / (frd / rb);
    result['ratio'] = ratio;

    return result;
  }

  private getResultString(re: any): any {

    const result: any = {
      Mdmin: { alien: 'center', value: '-' },
      Ndmin: { alien: 'center', value: '-' },
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

    if ('Mdmin' in re) {
      result.Mdmin = { alien: 'right', value: re.Mdmin.toFixed(1) };
    }
    if ('Ndmin' in re) {
      result.Ndmin = { alien: 'right', value: re.Ndmin.toFixed(1) };
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
      result.N = { alien: 'right', value: re.N.toFixed(0) };
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
    let ratio = 0;
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
