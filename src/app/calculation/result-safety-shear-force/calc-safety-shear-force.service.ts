import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetSectionService } from '../set-section.service';
import { SetSafetyFactorService } from '../set-safety-factor.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';
import { SetBarService } from '../set-bar.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyShearForceService {
  // 安全性（破壊）せん断力
  public DesignForceList: any[];

  constructor(private save: SaveDataService,
    private force: SetDesignForceService,
    private sectin: SetSectionService,
    private safety: SetSafetyFactorService,
    private result: ResultDataService,
    private base: CalcSafetyMomentService,
    private bar: SetBarService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      this.DesignForceList = new Array();
      return new Array();
    }

    const pickupNoList: any[] = new Array();
    pickupNoList.push(this.save.basic.pickup_shear_force_no[5]); // ピックアップNoは せん断の5番目に保存されている
    this.DesignForceList = this.force.getDesignForceList('ShearForce', pickupNoList);

    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    if (this.save.calc.print_selected.print_section_force_checked === false) {
      return result;
    }

    // ToDo: ここで、断面力テーブル用のデータを 変数 result に構築する

    return result;
  }

  // サーバー POST用データを生成する
  public getPostData(): any {

    // 断面力のエラーチェック
    if (this.DesignForceList === null) {
      this.setDesignForces();
    }
    if (this.DesignForceList.length < 1) {
      this.setDesignForces();
      if (this.DesignForceList.length < 1) {
        // Error!! - 計算対象がありません
        return null;
      }
    }

    // サーバーに送信するデータを作成
    const postData = this.setPostData(this.DesignForceList);
    return postData;
  }

  public setPostData(DesignForceList: any[]): any {
    return this.base.setPostData(DesignForceList, 'ShearForce');
  }

  // 変数の整理と計算
  public calcVmu(printData: any, resultData: any, position: any): any {

    const result: any = {}; // 印刷用
    const source: any = {}; // 計算用

    // 断面力
    let Md: number = this.save.toNumber(printData.Md);
    let Nd: number = this.save.toNumber(printData.Nd);
    const Vd: number = Math.abs(this.save.toNumber(printData.Vd));
    if (Md === null) { Md = 0; }
    result['Md'] = Md;
    source['Md'] = Md;
    if (Nd === null) { Nd = 0; }
    result['Nd'] = Nd;
    source['Nd'] = Nd;
    if (Vd === null) { return result; }
    result['Vd'] = Vd;
    source['Vd'] = Vd;

    // 断面形状
    let height: number = 0;
    if ('H' in printData) {
      height = this.save.toNumber(printData.H);
    }
    source['Height'] = height;

    let width: number = height;
    if ('B' in printData) {
      width = this.save.toNumber(printData.B);
    }
    source['Width'] = width;

    // 換算断面
    let h: number = 0;
    if ('Vyd_H' in printData) {
      h = this.save.toNumber(printData.Vyd_H);
      if (h === null) { return result; }
    }
    result['H'] = h;
    source['H'] = h; // 換算高

    let bw: number = 0;
    if ('Vyd_bw' in printData) {
      bw = this.save.toNumber(printData.Vyd_bw);
      if (bw === null) { return result; }
    }
    result['B'] = bw;
    source['B'] = bw; 

    // 引張鉄筋
    let Ast: number = 0;
    if ('Ast' in printData) {
      Ast = this.save.toNumber(printData.Vyd_Ast);
      if (Ast === null) { Ast = 0; }
    }
    result['Ast'] = Ast;
    result['AstString'] = printData.AstString;
    source['Ast'] = Ast;

    // 有効高さ
    let d: number = 0;
    if ('Vyd_d' in printData) {
      d = this.save.toNumber(printData.Vyd_d);
      if (d === null) { d = h; }
      d = d - ((height - h) / 2);
    }
    result['d'] = d;
    source['d'] = d;

    // 引張鉄筋比
    let pc: number = 0;
    if ('Vyd_pc' in printData) {
      pc = this.save.toNumber(printData.Vyd_pc);
      if (pc === null) { d = 0; }
    }
    source['pc'] = pc;

    //  tanθc + tanθt
    let tan: number = 0;
    let Vhd: number = 0;
    if ('tan' in position.barData) {
      tan = this.save.toNumber(position.barData.tan);
      if (tan === null) {
        tan = 0;
      } else {
        Vhd = Math.abs(Md) / d * this.bar.Radians(tan);
        result['tan'] = tan;
        result['Vhd'] = Vhd;
      }
    }
    source['tan'] = tan;
    source['Vhd'] = Vhd;

    // せん断スパン
    let La: number = Number.MAX_VALUE;
    if ('La' in position.barData) {
      La = this.save.toNumber(position.La);
      if (La === null) {
        La = Number.MAX_VALUE;
      }else{
        result['La'] = La;
      }
    }
    source['La'] = La;


    // 帯鉄筋
    let Aw: number = 0;
    if ('Aw' in printData) {
      Aw = this.save.toNumber(printData.Aw);
      if (Aw === null) { 
        Aw = 0; 
      }else{
        result['Aw'] = Aw;
        result['AwString'] = printData.AwString;
        result['fwyd'] = printData.fwyd;
      }
    }
    source['Aw'] = Aw;

    let fwyd: number = 0;
    if ('fwyd' in printData) {
      fwyd = this.save.toNumber(printData.fwyd);
      if (fwyd === null) { 
        fwyd = 0;
       } else{
        result['fwyd'] = fwyd;
       }
    }
    source['fwyd'] = fwyd;

    let deg: number = 90;
    if ('deg' in printData) {
      deg = this.save.toNumber(printData.deg);
      if (deg === null) { 
        deg = 90;
      }else{
        result['deg'] = deg;
      }
    }
    source['deg'] = deg;

    let Ss: number = Number.MAX_VALUE;
    if ('Ss' in printData) {
      Ss = this.save.toNumber(printData.Ss);
      if (Ss === null) { 
        Ss = Number.MAX_VALUE; 
      }else{
        result['Ss'] = Ss;
      }
    }
    source['Ss'] = Ss;

    // コンクリート材料
    let fck: number = 0;
    if ('fck' in printData) {
      fck = this.save.toNumber(printData.fck);
      if (fck === null) { return result; }
    }
    result['fck'] = fck;
    source['fck'] = fck;

    let rc: number = 0;
    if ('rc' in printData) {
      rc = this.save.toNumber(printData.rc);
      if (rc === null) { rc = 1; }
    }
    result['rc'] = rc;
    source['rc'] = rc;

    result['fcd'] = fck / rc;
    source['fcd'] = fck / rc;

    // 鉄筋材料
    let fsy: number = 0;
    if ('fsy' in printData) {
      fsy = this.save.toNumber(printData.fsy);
      if (fsy === null) { return result; }
    }
    result['fsy'] = fsy;
    source['fsy'] = fsy;

    let rs: number = 0;
    if ('rs' in printData) {
      rs = this.save.toNumber(printData.rs);
      if (rs === null) { rs = 1; }
    }
    result['rs'] = rs;
    source['rs'] = rs;

    result['fwyd'] = fsy / rs;
    source['fwyd'] = fsy / rs;


    // 部材係数
    let rbs: number = 1;
    if ('rbs' in printData) {
      rbs = this.save.toNumber(printData.rbs);
      if (rbs === null) { rbs = 1; }
    }
    result['rbs'] = rbs;
    source['rbs'] = rbs;

    result['Mu'] = resultData.M.Mi;
    source['Mu'] = resultData.M.Mi;

    // せん断耐力の照査
    let rbc: number = 1;
    if (La / d >= 2) {
      if ('rbc' in printData) {
        rbc = this.save.toNumber(printData.rbc);
        if (rbc === null) { rbc = 1; }
      }
      result['rbc'] = rbc;
      source['rbc'] = rbc;
  
      const Vyd: any = this.calcVyd(source);
      for (const key of Object.keys(Vyd)) {
        result[key] = Vyd[key];
      }
    } else {
      if ('rbd' in printData) {
        rbc = this.save.toNumber(printData.rbd);
        if (rbc === null) { rbc = 1; }
      }
      result['rbc'] = rbc;
      source['rbc'] = rbc;

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
    if ('ri' in printData) {
      ri = this.save.toNumber(printData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    let Vyd_Ratio: number = 0;
    if ('Vyd' in result) {
      Vyd_Ratio = (result.Vd - source.Vhd) / result.Vyd;
    } else if ('Vdd' in result) {
      Vyd_Ratio = (result.Vd - source.Vhd) / result.Vdd;
    }
    result['Vyd_Ratio'] = Vyd_Ratio;

    let Vyd_Result: string = 'NG';
    if (Vyd_Ratio < 1) {
      Vyd_Result = 'OK';
    }
    result['Vyd_Result'] = Vyd_Result;

    let Vwcd_Ratio: number = 0;
    if ('Vwcd' in result) {
      Vwcd_Ratio = (result.Vd - source.Vhd) / result.Vwcd;
    }
    result['Vwcd_Ratio'] = Vwcd_Ratio;

    let Vwcd_Result: string = 'NG';
    if (Vwcd_Ratio < 1) {
      Vwcd_Result = 'OK';
    }
    result['Vwcd_Result'] = Vwcd_Result;

    return result;

  }

  // 標準せん断耐力
  private calcVyd(source: any): any {
    const result = {};

    let fvcd: number = 0.2 * (Math.pow(source.fcd, 1 / 3));
    fvcd = Math.min(fvcd, 0.72);
    result['fvcd'] = fvcd;

    let Bd: number = Math.pow(1000 / source.d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result['Bd'] = Bd;

    let pc: number = source.pc;
    result['pc'] = pc;

    let Bp: number = Math.pow(100 * pc, 1 / 3);
    Bp = Math.min(Bp, 1.5);
    result['Bp'] = Bp;

    //M0 = NDD / AC * iC / Y
    let Mo: number = source.Nd * source.H / 6000;
    result['Mo'] = Mo;

    let Bn: number;
    if (source.Mu <= 0) {
      Bn = 1;
    } else if (source.Nd > 0) {
      Bn = 1 + 2 * Mo / source.Mu;
      Bn = Math.min(Bn, 2);
    } else {
      Bn = 1 + 4 * Mo / source.Mu;
      Bn = Math.max(Bn, 0);
    }
    result['Bn'] = Bn;

    let Vcd = Bd * Bp * Bn * fvcd * source.B * source.d / source.rbc;
    Vcd = Vcd / 1000;
    result['Vcd'] = Vcd;

    let z: number = source.d / 1.15;

    let Vsd = (
      source.Aw * source.fwyd * (
        Math.sin(this.bar.Radians(source.deg)) + Math.cos(this.bar.Radians(source.deg))
      ) / source.Ss
    ) * z / source.rbs;

    Vsd = Vsd / 1000;

    result['Vsd'] = Vsd;

    const Vyd: number = Vcd + Vsd;

    result['Vyd'] = Vyd;

    return result;
  }

  // 腹部コンクリートの設計斜め圧縮破壊耐力
  private calcVwcd(source: any): any {
    const result = {};

    let fwcd: number = 1.25 * (Math.sqrt(source.fcd));
    fwcd = Math.min(fwcd, 7.8);
    result['fwcd'] = fwcd;


    let Vwcd = fwcd * source.B * source.d / source.rbc;

    Vwcd = Vwcd / 1000;

    result['Vwcd'] = Vwcd;

    return result;
  }

  //設計せん断圧縮破壊耐力 Vdd
  private calcVdd(source: any): any {
    const result = {};

    let fdd: number = 0.19 * (Math.sqrt(source.fcd));
    result['fdd'] = fdd;

    let Bd: number = Math.pow(1000 / source.d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result['Bd'] = Bd;

    let pw: number = source.Aw / (source.Width * source.Ss);
    if (pw < 0.002) {
      pw = 0;
    }
    result['pw'] = pw;

    //せん断スパン比
    let ad: number = source.La / source.d;
    result['ad'] = ad;

    let Bw: number = 4.2 * Math.pow(100 * pw, 1 / 3) * (ad - 0.75) / Math.sqrt(source.fcd);
    Bw = Math.max(Bw, 0);
    result['Bw'] = Bw;

    //M0 = NDD / AC * iC / Y
    let Mo: number = source.Nd * source.Height / 6000;
    result['Mo'] = Mo;

    let Bn: number;
    if (source.Mu <= 0) {
      Bn = 1;
    } else if (source.Nd > 0) {
      Bn = 1 + 2 * Mo / source.Mu;
      Bn = Math.min(Bn, 2);
    } else {
      Bn = 1 + 4 * Mo / source.Mu;
      Bn = Math.max(Bn, 0);
    }
    result['Bn'] = Bn;

    let pc: number = source.pc;
    result['pc'] = pc;

    let Bp: number = (1 + Math.sqrt(100 * pc)) / 2;
    Bp = Math.min(Bp, 1.5);
    result['Bp'] = Bp;

    let Ba: number = 5 / (1 + Math.pow(ad, 2));
    result['Ba'] = Ba;


    let Vdd = (Bd * Bn + Bw) * Bp * Ba * fdd * source.B * source.d / source.rbd;

    Vdd = Vdd / 1000;

    result['Vdd'] = Vdd;

    return result;
  }

}

