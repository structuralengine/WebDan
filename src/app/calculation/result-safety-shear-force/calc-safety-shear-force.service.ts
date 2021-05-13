import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { SetBarService } from '../set-bar.service';

import { Injectable } from '@angular/core';
import { range } from 'rxjs';
import { Data } from '@angular/router';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyShearForceService {
  // 安全性（破壊）せん断力
  public DesignForceList: any[];
  public isEnable: boolean;

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private bar: SetBarService,
    private calc: InputCalclationPrintService,
    private basic: InputBasicInformationService) {
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

    this.DesignForceList = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(5));


  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Vd', '耐力', 2, this.DesignForceList);
    return postData;
  }

  // 出力テーブル用の配列にセット
  public getSafetyPages(
    responseData: any,
    postData: any,
    title: string = '安全性（破壊）せん断力の照査結果'): any[] {

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
            const postdata = position.PostData0[j];
            const PrintData = position.PrintData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultVmu: any = this.calcVmu(PrintData, resultData, position);
            const resultColumn: any = this.getResultString(PrintData, resultVmu);
            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position, postdata));

            ///////////////// 形状 /////////////////
            column.push(this.getShapeString_B(PrintData));
            column.push(this.getShapeString_H(PrintData));
            column.push(resultColumn.tan);
            /////////////// 引張鉄筋 ///////////////
            column.push(resultColumn.As);
            column.push(resultColumn.AsString);
            column.push(resultColumn.dst);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(PrintData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(PrintData, 'Ase');
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.Vd);
            column.push(resultColumn.La);

            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.Aw);
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);

            /////////////// 照査 ///////////////
            column.push(resultColumn.fvcd);
            column.push(resultColumn.Bd);
            column.push(resultColumn.Bp);
            column.push(resultColumn.Mu);
            column.push(resultColumn.Mo);
            column.push(resultColumn.Bn);
            column.push(resultColumn.ad);
            column.push(resultColumn.Ba);
            column.push(resultColumn.pw);
            column.push(resultColumn.Bw);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);
            column.push(resultColumn.rbs);
            column.push(resultColumn.Vsd);
            column.push(resultColumn.Vyd);
            column.push(resultColumn.ri);
            column.push(resultColumn.Vyd_Ratio);
            column.push(resultColumn.Vyd_Result);

            column.push(resultColumn.fwcd);
            column.push(resultColumn.Vwcd);
            column.push(resultColumn.Vwcd_Ratio);
            column.push(resultColumn.Vwcd_Result);

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

    // 照査表における 断面幅の文字列を取得
    public getShapeString_B(PrintData: any): any {

      const result = {alien: 'center', value: ''};
      switch (PrintData.shape) {
        case 'Circle':            // 円形
          result.value = 'R ' + PrintData.R.toString();
          break;
        case 'Ring':              // 円環
          result.value = 'R ' + PrintData.R.toString();
          result.value += ', ';
          result.value += 'r ' + PrintData.r.toString();
          break;
        case 'HorizontalOval':    // 水平方向小判形
        case 'VerticalOval':      // 鉛直方向小判形
        case 'InvertedTsection':  // 逆T形
        case 'Tsection':          // T形
        case 'Rectangle':         // 矩形
        default:
          result.value = PrintData.B.toString();
          break;
      }
      return result;
    }
  
    // 照査表における 断面高さの文字列を取得
    public getShapeString_H(PrintData: any): any {
  
      const result = {alien: 'center', value: ''};
      switch (PrintData.shape) {
        case 'Circle':            // 円形
          result.value = '□ ' + PrintData.Vyd_H.toFixed(1);
          break;
        case 'Ring':              // 円環
          result.value = 'H ' + PrintData.Vyd_H.toFixed(1);
          result.value += ', ';
          result.value += 'B ' + PrintData.Vyd_B.toFixed(1);
          break;
        case 'HorizontalOval':    // 水平方向小判形
        case 'VerticalOval':      // 鉛直方向小判形
        case 'InvertedTsection':  // 逆T形
        case 'Tsection':          // T形
        case 'Rectangle':         // 矩形
        default:
          result.value = PrintData.H.toString();
          break;
      }
      return result;
    }


  private getResultString(PrintData: any, re: any): any {

    const result = {
      tan: { alien: 'center', value: '-' },

      As: { alien: 'center', value: '-' },
      AsString: { alien: 'center', value: '-' },
      dst: { alien: 'center', value: '-' },

      Md: { alien: 'center', value: '-' },
      Nd: { alien: 'center', value: '-' },
      Vd: { alien: 'center', value: '-' },
      La: { alien: 'center', value: '-' },

      Aw: { alien: 'center', value: '-' },
      AwString: { alien: 'center', value: '-' },
      fwyd: { alien: 'center', value: '-' },
      deg: { alien: 'center', value: '-' },
      Ss: { alien: 'center', value: '-' },

      fvcd: { alien: 'center', value: '-' },
      Bd: { alien: 'center', value: '-' },
      Bp: { alien: 'center', value: '-' },
      Mu: { alien: 'center', value: '-' },
      Mo: { alien: 'center', value: '-' },
      Bn: { alien: 'center', value: '-' },
      ad: { alien: 'center', value: '-' },
      Ba: { alien: 'center', value: '-' },
      pw: { alien: 'center', value: '-' },
      Bw: { alien: 'center', value: '-' },
      rbc: { alien: 'center', value: '-' },
      Vcd: { alien: 'center', value: '-' },
      rbs: { alien: 'center', value: '-' },
      Vsd: { alien: 'center', value: '-' },
      Vyd: { alien: 'center', value: '-' },
      ri: { alien: 'center', value: '-' },
      Vyd_Ratio: { alien: 'center', value: '-' },
      Vyd_Result: { alien: 'center', value: '-' },
      fwcd: { alien: 'center', value: '-' },
      Vwcd: { alien: 'center', value: '-' },
      Vwcd_Ratio: { alien: 'center', value: '-' },
      Vwcd_Result: { alien: 'center', value: '-' }
    };


    if ('tan' in re) {
      result.tan = { alien: 'right', value: re.tan.toFixed(1) };
    }

    // 引張鉄筋
    if ('Ast' in re) {
      result.As = { alien: 'right', value: re.Ast.toFixed(1) };
    }
    if ('AstString' in re) {
      result.AsString = { alien: 'right', value: re.AstString };
    }
    if ('d' in re) {
      result.dst = { alien: 'right', value: (re.H - re.d).toFixed(1) };
    }

    // 断面力
    if ('Md' in re) {
      result.Md = { alien: 'right', value: re.Md.toFixed(1) };
    }
    if ('Nd' in re) {
      result.Nd = { alien: 'right', value: re.Nd.toFixed(1) };
    }
    if ('Vhd' in re) {
      // tanθc + tanθt があるとき
      const sVd: string = (re.Vd - re.Vhd).toFixed(1) + '(' + re.Vd.toFixed(1) + ')';
      result.Vd = { alien: 'right', value: sVd };
    } else {
      result.Vd = { alien: 'right', value: re.Vd.toFixed(1) };
    }

    if ('La' in re) {
      result.La = { alien: 'right', value: re.La.toFixed(0) };
    }

    // 帯鉄筋
    if ('Aw' in re) {
      result.Aw = { alien: 'right', value: re.Aw.toFixed(1) };
    }
    if ('AwString' in re) {
      result.AwString = { alien: 'right', value: re.AwString };
    }
    if ('fwyd' in re) {
      result.fwyd = { alien: 'right', value: re.fwyd.toFixed(0) };
    }
    if ('deg' in re) {
      result.deg = { alien: 'right', value: re.deg.toFixed(0) };
    }
    if ('Ss' in re) {
      result.Ss = { alien: 'right', value: re.Ss.toFixed(0) };
    }

    if ('fvcd' in re) {
      result.fvcd = { alien: 'right', value: re.fvcd.toFixed(3) };
    }
    if ('fdd' in re) {
      result.fvcd = { alien: 'right', value: re.fdd.toFixed(3) };
    }

    if ('Bd' in re) {
      result.Bd = { alien: 'right', value: re.Bd.toFixed(3) };
    }
    if ('Bp' in re) {
      result.Bp = { alien: 'right', value: re.Bp.toFixed(3) };
    }
    if ('Mu' in re) {
      result.Mu = { alien: 'right', value: re.Mu.toFixed(1) };
    }
    if ('Mo' in re) {
      result.Mo = { alien: 'right', value: re.Mo.toFixed(1) };
    }
    if ('Bn' in re) {
      result.Bn = { alien: 'right', value: re.Bn.toFixed(3) };
    }
    if ('ad' in re) {
      result.ad = { alien: 'right', value: re.ad.toFixed(3) };
    }
    if ('Ba' in re) {
      result.Ba = { alien: 'right', value: re.Ba.toFixed(3) };
    }
    if ('pw' in re) {
      result.pw = { alien: 'right', value: re.pw.toFixed(5) };
    }
    if ('Bw' in re) {
      result.Bw = { alien: 'right', value: re.Bw.toFixed(3) };
    }

    if ('rbc' in re) {
      result.rbc = { alien: 'right', value: re.rbc.toFixed(2) };
    }

    if ('Vcd' in re) {
      result.Vcd = { alien: 'right', value: re.Vcd.toFixed(1) };
    }
    if ('Vdd' in re) {
      result.Vcd = { alien: 'right', value: re.Vdd.toFixed(1) };
    }

    if ('rbs' in re) {
      result.rbs = { alien: 'right', value: re.rbs.toFixed(2) };
    }
    if ('Vsd' in re) {
      result.Vsd = { alien: 'right', value: re.Vsd.toFixed(1) };
    }

    if ('Vyd' in re) {
      result.Vyd = { alien: 'right', value: re.Vyd.toFixed(1) };
    }
    if ('Vdd' in re) {
      result.Vyd = { alien: 'right', value: re.Vdd.toFixed(1) };
    }

    if ('ri' in re) {
      result.ri = { alien: 'right', value: re.ri.toFixed(2) };
    }

    if ('Vyd_Ratio' in re) {
      result.Vyd_Ratio = { alien: 'right', value: re.Vyd_Ratio.toFixed(3) };
    }
    if ('Vyd_Result' in re) {
      result.Vyd_Result = { alien: 'center', value: re.Vyd_Result };
    }

    if ('fwcd' in re) {
      result.fwcd = { alien: 'right', value: re.fwcd.toFixed(3) };
    }
    if ('Vwcd' in re) {
      result.Vwcd = { alien: 'right', value: re.Vwcd.toFixed(1) };
    }
    if ('Vwcd_Ratio' in re) {
      result.Vwcd_Ratio = { alien: 'right', value: re.Vwcd_Ratio.toFixed(3) };
    }
    if ('Vwcd_Result' in re) {
      result.Vwcd_Result = { alien: 'center', value: re.Vwcd_Result };
    }

    return result;

  }


  // 変数の整理と計算
  public calcVmu(PrintData: any, resultData: any, position: any): any {

    const result: any = {}; // 印刷用
    const source: any = {}; // 計算用

    // 断面力
    let Md: number = this.helper.toNumber(PrintData.Md);
    let Nd: number = this.helper.toNumber(PrintData.Nd);
    let Vd: number = Math.abs(this.helper.toNumber(PrintData.Vd));
    if (Md === null) { Md = 0; }
    Md = Math.abs(Md);
    result['Md'] = Md;
    source['Md'] = Md;
    if (Nd === null) { Nd = 0; }
    result['Nd'] = Nd;
    source['Nd'] = Nd;
    if (Vd === null) { return result; }
    Vd = Math.abs(Vd);
    result['Vd'] = Vd;
    source['Vd'] = Vd;

    // 換算断面
    let h: number = 0;
    if ('Vyd_H' in PrintData) {
      h = this.helper.toNumber(PrintData.Vyd_H);
      if (h === null) { return result; }
    }
    result['H'] = h;
    source['H'] = h; // 換算高

    let bw: number = 0;
    if ('Vyd_B' in PrintData) {
      bw = this.helper.toNumber(PrintData.Vyd_B);
      if (bw === null) { return result; }
    }
    result['B'] = bw;
    source['B'] = bw;

    // 引張鉄筋
    let Ast: number = 0;
    if ('Vyd_Ast' in PrintData) {
      Ast = this.helper.toNumber(PrintData.Vyd_Ast);
      if (Ast === null) { Ast = 0; }
    } else if ('Ast' in PrintData) {
      Ast = this.helper.toNumber(PrintData.Ast);
      if (Ast === null) { Ast = 0; }
    }
    result['Ast'] = Ast;

    if ('Vyd_AstString' in PrintData) {
      result['AstString'] = PrintData.Vyd_AstString;
    } else  {
      result['AstString'] = PrintData.AstString;
    }

    // 有効高さ
    let d: number = 0;
    if ('Vyd_d' in PrintData) {
      d = this.helper.toNumber(PrintData.Vyd_d);
      if (d === null) { d = h; }
    }
    result['d'] = d;
    source['d'] = d;

    // 引張鉄筋比
    let pc: number = 0;
    if ('Vyd_pc' in PrintData) {
      pc = this.helper.toNumber(PrintData.Vyd_pc);
      if (pc === null) { d = 0; }
    }
    source['pc'] = pc;

    //  tanθc + tanθt
    let tan: number = 0;
    let Vhd: number = 0;
    if ('tan' in position.barData) {
      tan = this.helper.toNumber(position.barData.tan);
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
    let La: number;
    if ('La' in position) {
      La = this.helper.toNumber(position.La);
      if (La === null) {
        La = Number.MAX_VALUE;
      } else {
        if (La === 1) {
          La = Math.abs(Md / Vd) * 1000; // せん断スパン=1 は せん断スパンを自動で計算する
        } 
        result['La'] = La;
      }
    }
    source['La'] = La;


    // 帯鉄筋
    let Aw: number = 0;
    if ('Aw' in PrintData) {
      Aw = this.helper.toNumber(PrintData.Aw);
      if (Aw === null) {
        Aw = 0;
      } else {
        result['Aw'] = Aw;
        result['AwString'] = PrintData.AwString;
        result['fwyd'] = PrintData.fwyd;
      }
    }
    source['Aw'] = Aw;

    let fwyd: number = 0;
    if ('fwyd' in PrintData) {
      fwyd = this.helper.toNumber(PrintData.fwyd);
      if (fwyd === null) {
        fwyd = 0;
      } else {
        result['fwyd'] = fwyd;
      }
    }
    source['fwyd'] = fwyd;

    let deg: number = 90;
    if ('deg' in PrintData) {
      deg = this.helper.toNumber(PrintData.deg);
      if (deg === null) {
        deg = 90;
      } else {
        result['deg'] = deg;
      }
    }
    source['deg'] = deg;

    let Ss: number = Number.MAX_VALUE;
    if ('Ss' in PrintData) {
      Ss = this.helper.toNumber(PrintData.Ss);
      if (Ss === null) {
        Ss = Number.MAX_VALUE;
      } else {
        result['Ss'] = Ss;
      }
    }
    source['Ss'] = Ss;

    // コンクリート材料
    let fck: number = 0;
    if ('fck' in PrintData) {
      fck = this.helper.toNumber(PrintData.fck);
      if (fck === null) { return result; }
    }
    result['fck'] = fck;
    source['fck'] = fck;

    // 杭の施工条件による計数
    let rfck: number = 1;
    if ('rfck' in PrintData) {
      rfck = this.helper.toNumber(PrintData.rfck);
      if (rfck === null) { rfck = 1; }
    }

    let rVcd: number = 1;
    if ('rVcd' in PrintData) {
      rVcd = this.helper.toNumber(PrintData.rVcd);
      if (rVcd === null) { rVcd = 1; }
    }
    source['rVcd'] = rVcd;


    let rc: number = 0;
    if ('rc' in PrintData) {
      rc = this.helper.toNumber(PrintData.rc);
      if (rc === null) { rc = 1; }
    }
    result['rc'] = rc;
    source['rc'] = rc;

    result['fcd'] = rfck * fck / rc;
    source['fcd'] = rfck * fck / rc;

    // 鉄筋材料
    let fsy: number = 0;
    if ('fsy' in PrintData) {
      fsy = this.helper.toNumber(PrintData.fsy);
      if (fsy === null) { return result; }
    }
    result['fsy'] = fsy;
    source['fsy'] = fsy;

    let rs: number = 0;
    if ('rs' in PrintData) {
      rs = this.helper.toNumber(PrintData.rs);
      if (rs === null) { rs = 1; }
    }
    result['rs'] = rs;
    source['rs'] = rs;

    result['fsyd'] = fsy / rs;
    source['fsyd'] = fsy / rs;


    // 部材係数
    result['Mu'] = resultData.M.Mi;
    source['Mu'] = resultData.M.Mi;

    // せん断耐力の照査
    let rbc: number = 1;
    if (La / d >= 2) {
      if ('rbc' in PrintData) {
        rbc = this.helper.toNumber(PrintData.rbc);
        if (rbc === null) { rbc = 1; }
      }
      result['rbc'] = rbc;
      source['rbc'] = rbc;

      let rbs: number = 1;
      if ('rbs' in PrintData) {
        rbs = this.helper.toNumber(PrintData.rbs);
        if (rbs === null) { rbs = 1; }
      }
      result['rbs'] = rbs;
      source['rbs'] = rbs;

      const Vyd: any = this.calcVyd(source);
      for (const key of Object.keys(Vyd)) {
        result[key] = Vyd[key];
      }
    } else {
      if ('rbd' in PrintData) {
        rbc = this.helper.toNumber(PrintData.rbd);
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
    if ('ri' in PrintData) {
      ri = this.helper.toNumber(PrintData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    let Vyd_Ratio: number = 0;
    if ('Vyd' in result) {
      Vyd_Ratio = ri * (result.Vd - source.Vhd) / result.Vyd;
    } else if ('Vdd' in result) {
      Vyd_Ratio = ri * (result.Vd - source.Vhd) / result.Vdd;
    }
    result['Vyd_Ratio'] = Vyd_Ratio;

    let Vyd_Result: string = 'NG';
    if (Vyd_Ratio < 1) {
      Vyd_Result = 'OK';
    }
    result['Vyd_Result'] = Vyd_Result;

    let Vwcd_Ratio: number = 0;
    if ('Vwcd' in result) {
      Vwcd_Ratio = ri * (result.Vd - source.Vhd) / result.Vwcd;
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
    Vcd = Vcd * source.rVcd; // 杭の施工条件
    result['Vcd'] = Vcd;

    let z: number = source.d / 1.15;
    result['z'] = z;

    let sinCos: number = Math.sin(this.bar.Radians(source.deg)) + Math.cos(this.bar.Radians(source.deg));
    result['sinCos'] = sinCos;

    let Vsd = (source.Aw * source.fwyd * sinCos / source.Ss) * z / source.rbs;

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

  // 設計せん断圧縮破壊耐力 Vdd
  private calcVdd(source: any): any {
    const result = {};

    let fdd: number = 0.19 * (Math.sqrt(source.fcd));
    result['fdd'] = fdd;

    let Bd: number = Math.pow(1000 / source.d, 1 / 4);
    Bd = Math.min(Bd, 1.5);
    result['Bd'] = Bd;

    let pw: number = source.Aw / (source.B * source.Ss);
    result['pw'] = pw;
    if (pw < 0.002) {
      pw = 0;
    }

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


    let Vdd = (Bd * Bn + Bw) * Bp * Ba * fdd * source.B * source.d / source.rbc;

    Vdd = Vdd / 1000;

    result['Vdd'] = Vdd;

    return result;
  }
}

