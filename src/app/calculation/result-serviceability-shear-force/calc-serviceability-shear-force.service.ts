import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';
import { InputCrackSettingsService } from 'src/app/components/crack/crack-settings.service';
import { SaveDataService } from 'src/app/providers/save-data.service';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityShearForceService {

  // 耐久性 せん断ひび割れ
  public DesignForceList: any[];  // せん断ひび割れ検討判定用
  public DesignForceList1: any[]; // 永久荷重
  public DesignForceList2: any[]; // 変動荷重
  public isEnable: boolean;
  public safetyID: number = 0;

  constructor(
    private save: SaveDataService,
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private crack: InputCrackSettingsService,
    private base: CalcSafetyShearForceService) {
    this.DesignForceList = null;
    this.isEnable = false;
    }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void{

    this.isEnable = false;

    this.DesignForceList= new Array();

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    // せん断ひび割れ検討判定用
    // せん断ひび割れにの検討における Vcd は １つ目の ピックアップ（永久＋変動）の Mu を使う
    const No0 = (this.save.isManual()) ? 0 : this.basic.pickup_shear_force_no(0);
    this.DesignForceList = this.force.getDesignForceList(
      'Vd', No0);
    // 永久荷重
    const No1 = (this.save.isManual()) ? 1 : this.basic.pickup_shear_force_no(1);
    this.DesignForceList1 = this.force.getDesignForceList(
      'Vd', No1);

    // 変動荷重
    const No2 = (this.save.isManual()) ? 2 : this.basic.pickup_shear_force_no(2);
    this.DesignForceList2 = this.force.getDesignForceList(
      'Vd', No2);

    if (this.DesignForceList2.length < 1){
      this.DesignForceList2 = this.force.getLiveload(this.DesignForceList , this.DesignForceList1);
    }

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1 ) {
      return null;
    }

    // 有効なデータかどうか
    const force1 = this.force.checkEnable('Vd', this.safetyID, this.DesignForceList1, this.DesignForceList, this.DesignForceList2);

    // 複数の断面力の整合性を確認する
    const force2 = this.force.alignMultipleLists(force1[0], force1[1], force1[2]);

    // POST 用
    const postData = this.post.setInputData('Vd', '耐力', this.safetyID, force2[0]);
    return postData;
  }

  public getSafetyFactor(g_id: any) {
    return this.safety.getCalcData('Vd', g_id, this.safetyID);
  }

  public calcSigma(
    res: any,
    section: any,
    fc: any,
    safety: any): any {

    // せん断ひび割れ検討判定用
    let force0 = this.DesignForceList.find(
      (v) => v.index === res.index
    ).designForce.find((v) => v.side === res.side);
    if(force0 === undefined){
      force0 = { Md: 0, Nd: 0, Vd: 0}
    }

    // 永久荷重
    const force1 = this.DesignForceList1.find(
      (v) => v.index === res.index
    ).designForce.find((v) => v.side === res.side);
    // せん断耐力
    const result: any = this.base.calcVmu(
      res, section, fc, safety, null, force1);

      // 変動荷重
    let force2 = this.DesignForceList2.find(
      (v) => v.index === res.index
    ).designForce.find((v) => v.side === res.side);
    if(force2 === undefined){
      force2 = { Md: 0, Nd: 0, Vd: 0}
    }

    let Vd: number = Math.abs(force0.Vd);
    result['Vd'] = Vd;

    let Vpd: number = this.helper.toNumber(force1.Vd);
    if (Vpd === null) { Vpd = 0; }
    Vpd = Math.abs(Vpd);
    result['Vpd'] = Vpd;

    let Vrd: number = this.helper.toNumber(force2.Vd);
    if (Vrd === null || Vrd === 0) { Vrd = Vd - Vpd; }
    Vrd = Math.abs(Vrd);
    result['Vrd'] = Vrd;

    let Vcd07: number = 0.7 * result.Vcd;
    result['Vcd07'] = Vcd07;

    if (Vd <= Vcd07) {
      result['Result'] = 'OK';
      return result;
    }

    // 環境条件
    const crackInfo = this.crack.getTableColumn(res.index);

    let conNum: number = this.helper.toNumber(crackInfo.con_s);
    if (conNum === null) { conNum = 1; }

    // 制限値
    let sigma12: number = 120;
    switch (conNum) {
      case 1:
        sigma12 = (section.Aw.fwyd !== 235) ? 120 : 100;
        result['con'] = '一般の環境';
        break;
      case 2:
        sigma12 = (section.Aw.fwyd !== 235) ? 100 : 80;
        result['con'] = '腐食性環境';
        break;
      case 3:
        sigma12 = (section.Aw.fwyd !== 235) ? 80 : 60;
        result['con'] = '厳しい腐食';
        break;
    }
    result['sigma12'] = sigma12;

    // せん断補強鉄筋の設計応力度
    let kr: number = this.helper.toNumber(crackInfo.kr);
    if (kr === null) { kr = 0.5; }
    result['kr'] = kr;

    const VpdVrd_krVcd_s: number = (Vpd + Vrd - kr * result.Vcd) * result.Ss;
    const AwZsinCos: number = result.Aw * result.z * result.sinCos;
    const VpdVcd: number = Vpd + result.Vcd;
    const VpdVrdVcd: number = Vpd + Vrd + result.Vcd;

    const sigmaw = (VpdVrd_krVcd_s / AwZsinCos) * (VpdVcd / VpdVrdVcd) * 1000;
    result['sigmaw'] = sigmaw;

    // 安全率
    const Ratio: number = result.ri * sigmaw / sigma12;
    result['Ratio'] = Ratio;

    let Result: string = 'NG';
    if (Ratio < 1) {
      Result = 'OK';
    }
    result['Result'] = Result;

    return result;

  }


}
