import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetSectionService } from '../set-section.service';
import { SetSafetyFactorService } from '../set-safety-factor.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';

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
    private calc: ResultDataService,
    private base: CalcSafetyMomentService) {
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
    return this.base.setPostData(DesignForceList);
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
          for (let j = 0; j < position.PostData.length; j++) {
            const postdata = position.PostData[j];
            const printData = position.printData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push(this.calc.getTitleString1(member, position));
            column.push(this.calc.getTitleString2(position, postdata));
            column.push(this.calc.getTitleString3(position));

            ///////////////// 形状 /////////////////
            column.push(this.calc.getShapeString_B_Bf(printData));
            column.push(this.calc.getShapeString_H_Hf(printData));
            column.push(this.calc.getTan(position.barData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.calc.getAsString(printData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.calc.getAsString(printData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.calc.getAsString(printData, 'Ase');
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.calc.getFckString(printData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.calc.getFskString(printData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 照査 ///////////////
            const resultColumn: any = this.getResultString(printData, resultData, position);
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.Vd);
            column.push(resultColumn.La);

            /////////////// 帯鉄筋情報 ///////////////
            const Aw: any = this.calc.getAwString(printData);
            column.push(Aw.As);
            column.push(Aw.AsString);
            column.push(Aw.fsk);
            column.push(Aw.deg);
            column.push(Aw.Ss);

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

  private getResultString(printData: any, resultData: any, position: any): any {

    const result = {
      Md: { alien: 'center', value: '-' },
      Nd: { alien: 'center', value: '-' },
      Vd: { alien: 'center', value: '-' },
      La: { alien: 'center', value: '-' },
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
    }

    const Vyd: any = this.calcVyd(printData, resultData, position);
    if (Vyd === null) { return result; }
    
    // 断面力
    result.Md = { alien: 'right', value: Vyd.Md.toFixed(1) };
    result.Nd = { alien: 'right', value: Vyd.Nd.toFixed(1) };    if (Vd === null) { return result; }
    result.Vd = { alien: 'right', value: Vyd.Vd.toFixed(1) };

    // せん断スパン
    let La: number = position.La;
    if (La !== null) {
      result.La = { alien: 'right', value: La.toFixed(0) };
    }



    const Mu: number = resultData.M.Mi;
    const rb: number = position.safety_facto.rb;
    const ri: number = position.safety_facto.ri;
    const ratio: number = Math.abs(ri * Md / Mu);
    const Vyd_Result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Md: { alien: 'right', value: Md.toFixed(1) },
      Nd: { alien: 'right', value: printData.Nd.toFixed(1) },
      Vd: { alien: 'right', value: printData.Vd.toFixed(1) },

      La: { alien: 'center', value: '-' },
      fvcd: { alien: 'center', value: '-' },
      Bd: { alien: 'center', value: '-' },
      Bp: { alien: 'center', value: '-' },
      Mu: { alien: 'right', value: Mu.toFixed(1) },
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
      ri: { alien: 'right', value: ri.toFixed(2) },
      Vyd_Ratio: { alien: 'right', value: ratio.toFixed(3) },
      Vyd_Result: { alien: 'center', value: Vyd_Result },

      fwcd: { alien: 'center', value: '-' },
      Vwcd: { alien: 'center', value: '-' },
      Vwcd_Ratio: { alien: 'right', value: ratio.toFixed(3) },
      Vwcd_Result: { alien: 'center', value: Vyd_Result }

    };

  }

  public calcVyd(printData: any, resultData: any, position: any): any {

    const result = {};

    // 断面力
    let Md: number = this.save.toNumber(printData.Md);
    let Nd: number = this.save.toNumber(printData.Nd);
    let Vd: number = this.save.toNumber(printData.Vd);
    if (Md === null) { Md = 0; }
    result['Md'] = Md;
    if (Nd === null) { Md = 0; }
    result['Nd'] = Nd;
    if (Vd === null) { return null; }

    // せん断スパン
    let La: number = this.save.toNumber(position.La);
    result['La'] = La;
    if (La === null) {
      La = Number.MAX_VALUE;
    }

    // 帯鉄筋
    let Aw: number = 0;
    if ('Aw' in printData) {
      Aw = this.save.toNumber(printData.Aw);
      if (Aw === null) {Aw = 0;}
    }
    let fwyd: number = 0;
    if ('fwyd' in printData) {
      fwyd = this.save.toNumber(printData.fwyd);
      if (fwyd === null) { fwyd = 0; }
    }
    let deg: number = 90;
    if ('deg' in printData) {
      deg = this.save.toNumber(printData.deg);
      if (deg === null) { deg = 90; }
    }
    let Ss: number = Number.MAX_VALUE;
    if ('Ss' in printData) {
      Ss = this.save.toNumber(printData.Ss);
      if (Ss === null) { Ss = Number.MAX_VALUE; }
    }

    // 引張鉄筋
    let Ast: number = 0;
    if ('Ast' in printData) {
      Ast = this.save.toNumber(printData.Ast);
      if (Ast === null) { Ast = 0; }
    } 
    let dst: number = 0;
    if ('dst' in printData) {
      dst = this.save.toNumber(printData.dst);
      if (dst === null) { dst = 0; }
    }    

    // 断面
    

  }
    
}
