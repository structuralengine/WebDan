import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

import { Injectable, ViewChild } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputFatiguesService } from 'src/app/components/fatigues/fatigues.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueShearForceService {

  // 安全性（疲労破壊）せん断力
  public DesignForceList: any[];  // 永久+変動作用
  public DesignForceList2: any[]; // 変動応力
  public DesignForceList3: any[]; // 永久作用
  public isEnable: boolean;
  public safetyID: number = 1;

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private save: SaveDataService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcSafetyShearForceService,
    private fatigue: InputFatiguesService,
    private basic: InputBasicInformationService,
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

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    // 列車本数の入力がない場合は処理を抜ける
    if (this.helper.toNumber(this.fatigue.train_A_count) === null &&
      this.helper.toNumber(this.fatigue.train_B_count) === null) {
      return;
    }

    // 最小応力
    this.DesignForceList3 = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(3));
    // 最大応力
    this.DesignForceList = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(4));

    // 複数の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList3);

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
      const force2 = this.DesignForceList2[ip].designForce;
      const force3 = this.DesignForceList3[ip].designForce;

      // 疲労に用いる係数を取得する
      const info = this.fatigue.getCalcData(pos.index);
      for (let i = force0.length - 1; i >= 0; i--) {
        // 係数に１つも有効な数値がなければ削除
        let enable = false;
        for(const k of Object.keys(info.share)){
          if(info.share[k] !== null){
            enable = true;
            break;
          }
        }
        if((enable === false) ||(force0[i].Md === 0)) {
          force0.splice(i, 1);
          force2.splice(i, 1);
          force3.splice(i, 1);
        } else {
          force0['fatigue'] = info.share;
        }
      }

      if (pos.designForce.length < 1) {
        this.DesignForceList.splice(ip, 1);
        this.DesignForceList2.splice(ip, 1);
        this.DesignForceList3.splice(ip, 1);
      }
    }
  }

  // 
  public getSafetyFactor(g_id: any) {
    return this.safety.getCalcData('Md', g_id, this.safetyID);
  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Vd', '耐力', this.safetyID, this.DesignForceList);
    return postData;
  }

  public calcFatigue(PrintData: any, position: any): any {
    
    const postdata0: any={}, postdata1: any={};

    if ('La' in PrintData) { delete PrintData.La; } // Vcd を計算するので La は削除する
    if ('Nd' in PrintData) { PrintData.Nd = 0; }    // 疲労の Vcd を計算する時は βn=1
    const resultData = { M: { Mi: 0 } };
    const result: any = this.base.calcVmu(PrintData, resultData, position);

    // 最小応力
    let Vpd: number;
    if ('Vd' in postdata1) {
      Vpd = this.helper.toNumber(postdata0.Vd);
      if (Vpd === null) { return result; }
    } else {
      return result;
    }
    result.Vpd = Vpd;

    let Mpd: number;
    if ('Md' in PrintData) {
      Mpd = this.helper.toNumber(PrintData.Md);
      if (Mpd !== null) {
        result['Mpd'] = Mpd;
      }
    }

    let Npd: number;
    if ('Nd' in postdata0) {
      Npd = this.helper.toNumber(postdata0.Nd);
      if (Npd !== null) {
        result['Npd'] = Npd;
      }
    }
    // 変動応力
    let Vrd: number;
    if ('Vd' in postdata1) {
      Vrd = this.helper.toNumber(postdata1.Vd);
      if (Vrd === null) { return result; }
    } else {
      return result;
    }
    result['Vrd'] = Vrd;

    let Mrd: number;
    if ('Md' in postdata1) {
      Mrd = this.helper.toNumber(postdata1.Md);
      if (Mrd !== null) {
        result['Mrd'] = Mrd;
      }
    }

    let Nrd: number;
    if ('Nd' in postdata1) {
      Nrd = this.helper.toNumber(postdata1.Nd);
      if (Nrd !== null) {
        result['Nrd'] = Nrd;
      }
    }

    // せん断補強鉄筋の設計応力度
    let kr: number = this.helper.toNumber(position.memberInfo.kr);
    if (kr === null) { kr = 0.5; }
    result['kr'] = kr;

    // スターラップの永久応力度
    const tmpWrd1: number = Vpd + Vrd - kr * result.Vcd;
    const tmpWrd2: number = (result.Aw * result.z) / result.Ss;
    const tmpWrd3: number = Vpd + result.Vcd;
    const tmpWrd4: number = Vpd + Vrd + result.Vcd;
    let sigma_min: number = (tmpWrd1 / tmpWrd2) * (tmpWrd3 / tmpWrd4);
    if (sigma_min === null) { return result; }
    sigma_min = sigma_min * 1000;
    result['sigma_min'] = sigma_min;

    // スターラップの変動応力度
    let sigma_rd: number = (tmpWrd1 / tmpWrd2) * (Vrd / tmpWrd4);
    if (sigma_rd === null) { return result; }
    sigma_rd = sigma_rd * 1000;
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
    if ('AW-φ' in PrintData) {
      fai = this.helper.toNumber(PrintData['AW-φ']);
      if (fai === null) { return result; }
    } else {
      return result;
    }

    let fwud: number;
    if ('fwud' in PrintData) {
      fwud = this.helper.toNumber(PrintData.fwud);
      if (fwud === null) { return result; }
    } else {
      return result;
    }
    result['fwud'] = fwud;

    let r1 = 1;
    if ('r1_2' in position.memberInfo) {
      r1 = this.helper.toNumber(position.memberInfo.r1_2);
      if (r1 === null) { r1 = 1; }
    }
    result['r1'] = r1;

    let ar: number = 3.09 - 0.003 * fai;

    let reference_count: number = this.helper.toNumber(this.fatigue.reference_count);
    if (reference_count === null) {
      reference_count = 2000000;
    }
    const tmp201: number = Math.pow(10, ar) / Math.pow(reference_count, k);
    const tmp202: number = 1 - sigma_min / fwud;
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
    result['k']  = k;
    result['ar']  = ar;

    // 標準列車荷重観山の総等価繰返し回数 N の計算
    let T: number = this.helper.toNumber(this.fatigue.service_life);
    if (T === null) { return result; }

    const j = this.getTrainCount();
    const jA = j[0];
    const jB = j[1];

    let inputFatigue: any;
    switch (PrintData.side) {
      case '上側引張':
        inputFatigue = position.fatigueData.V1;
        break;
      case '下側引張':
        inputFatigue = position.fatigueData.V2;
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

    // frd の計算
    const tmpR21: number = Math.pow(a, 1 / k);
    const tmpR22: number = Math.pow(1 - a, 1 / k);
    const tmpR23: number = (tmpR21 + tmpR22) * ((1 - b) + b);
    const r2: number = Math.pow(1 / tmpR23, k);
    result['r2'] = r2;

    const tmpfrd1: number = Math.pow(10, ar) / Math.pow(N, k);
    const tmpfrd2: number = 1 - sigma_min / fwud;
    const frd: number = r1 * r2 * tmpfrd1 * tmpfrd2 / rs;
    result['frd'] = frd;

    if (ratio200 < 1 && N <= reference_count) {
      return result;
    }
    const ratio: number = ri * sigma_rd / (frd / rb);
    result['ratio'] = ratio;

    return result;

  }



}
