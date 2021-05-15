import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityShearForceService {
  // 耐久性 せん断ひび割れ
  public DesignForceList: any[];  // せん断ひび割れ検討判定用
  public DesignForceList1: any[]; // 永久荷重
  public DesignForceList2: any[]; // 変動荷重
  public isEnable: boolean;

  constructor(
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
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
    this.DesignForceList = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(0));
    // 永久荷重
    this.DesignForceList1 = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(1));

    // DesignForceList と DesignForceList1 の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList1);

    // 変動荷重
    this.DesignForceList2 = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no(2));
    if (this.DesignForceList2.length < 1){
      this.DesignForceList2 = this.force.getLiveload(this.DesignForceList , this.DesignForceList1);
    }

    // DesignForceList と DesignForceList2 の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList2);

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1 ) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Vd', '耐力', 0, this.DesignForceList);
    return postData;
  }

  public calcSigma(PrintData: any, postdata1: any, PostData2: any,
                   resultData: any, position: any): any {

    const result: any = this.base.calcVmu(PrintData, resultData, position);

    let Vd: number = Math.abs(result.Vd);

    let Vpd: number = this.helper.toNumber(postdata1.Vd);
    if (Vpd === null) { Vpd = 0; }
    Vpd = Math.abs(Vpd);
    result['Vpd'] = Vpd;

    let Vrd: number = this.helper.toNumber(PostData2.Vd);
    if (Vrd === null) { Vrd = Vd - Vpd; }
    if (Vrd === 0) { Vrd = Vd - Vpd; }
    Vrd = Math.abs(Vrd);
    result['Vrd'] = Vrd;

    let Vcd07: number = 0.7 * result.Vcd;
    result['Vcd07'] = Vcd07;

    if (Vd <= Vcd07) {
      result['Result'] = 'OK';
      return result;
    }

    // 環境条件
    let conNum: number = this.helper.toNumber(position.memberInfo.con_s);
    if (conNum === null) { conNum = 1; }

    // 制限値
    let sigma12: number = 120;
    switch (conNum) {
      case 1:
        sigma12 = (PrintData.fwyd !== 235) ? 120 : 100;
        result['con'] = '一般の環境';
        break;
      case 2:
        sigma12 = (PrintData.fwyd !== 235) ? 100 : 80;
        result['con'] = '腐食性環境';
        break;
      case 3:
        sigma12 = (PrintData.fwyd !== 235) ? 80 : 60;
        result['con'] = '厳しい腐食';
        break;
    }
    result['sigma12'] = sigma12;

    // せん断補強鉄筋の設計応力度
    let kr: number = this.helper.toNumber(position.memberInfo.kr);
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

  public getResultString(re: any): any {

    const result = {
      B: { alien: 'center', value: '-' },
      H: { alien: 'center', value: '-' },
      tan: { alien: 'center', value: '-' },

      As: { alien: 'center', value: '-' },
      AsString: { alien: 'center', value: '-' },
      dst: { alien: 'center', value: '-' },

      Aw: { alien: 'center', value: '-' },
      AwString: { alien: 'center', value: '-' },
      fwyd: { alien: 'center', value: '-' },
      deg: { alien: 'center', value: '-' },
      Ss: { alien: 'center', value: '-' },

      Nd: { alien: 'center', value: '-' },
      Vhd: { alien: 'center', value: '-' },
      Vpd: { alien: 'center', value: '-' },
      Vrd: { alien: 'center', value: '-' },

      fvcd: { alien: 'center', value: '-' },
      Bd: { alien: 'center', value: '-' },
      pc: { alien: 'center', value: '-' },
      Bp: { alien: 'center', value: '-' },
      Mu: { alien: 'center', value: '-' },
      Mo: { alien: 'center', value: '-' },
      Bn: { alien: 'center', value: '-' },
      rbc: { alien: 'center', value: '-' },
      Vcd: { alien: 'center', value: '-' },
      Vcd07: { alien: 'center', value: '-' },

      con: { alien: 'center', value: '-' },
      kr: { alien: 'center', value: '-' },
      ri: { alien: 'center', value: '-' },

      sigma: { alien: 'center', value: '-' },
      Ratio: { alien: 'center', value: '-' },
      Result: { alien: 'center', value: '-' },
    };

    // 断面
    if ('B' in re) {
      result.B = { alien: 'right', value: re.B.toFixed(0) };
    }
    if ('H' in re) {
      result.H = { alien: 'right', value: re.H.toFixed(0) };
    }
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

    // 断面力
    if ('Nd' in re) {
      result.Nd = { alien: 'right', value: re.Nd.toFixed(1) };
    }
    let Vhd: number = re.Vd;
    if ('Vhd' in re) {
      // tanθc + tanθt があるとき
      Vhd = re.Vd - re.Vhd;
      const sVd: string = Vhd.toFixed(1) + '(' + re.Vd.toFixed(1) + ')';
      result.Vhd = { alien: 'right', value: sVd };
    } else {
      result.Vhd = { alien: 'right', value: Vhd.toFixed(1) };
    }
    if ('Vpd' in re) {
      result.Vpd = { alien: 'right', value: re.Vpd.toFixed(1) };
    }
    if ('Vrd' in re) {
      result.Vrd = { alien: 'right', value: re.Vrd.toFixed(1) };
    }

    // 耐力
    if ('fvcd' in re) {
      result.fvcd = { alien: 'right', value: re.fvcd.toFixed(3) };
    }
    if ('Bd' in re) {
      result.Bd = { alien: 'right', value: re.Bd.toFixed(3) };
    }
    if ('pc' in re) {
      result.pc = { alien: 'right', value: re.pc.toFixed(5) };
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
    if ('rbc' in re) {
      result.rbc = { alien: 'right', value: re.rbc.toFixed(2) };
    }
    if ('Vcd' in re) {
      result.Vcd = { alien: 'right', value: re.Vcd.toFixed(1) };
    }
    if ('Vcd07' in re) {
      if ( Vhd <= re.Vcd07 ) {
        const str: string = Vhd.toFixed(1) +  '<' +  re.Vcd07.toFixed(1);
        result.Vcd07 = { alien: 'center', value: str };
      } else {
        const str: string = Vhd.toFixed(1) +  '>' +  re.Vcd07.toFixed(1);
        result.Vcd07 = { alien: 'center', value: str };
      }
    }

    if ('con' in re) {
      result.con = { alien: 'center', value: re.con };
    }
    if ('kr' in re) {
      result.kr = { alien: 'right', value: re.kr.toFixed(1) };
    }
    if ('ri' in re) {
      result.ri = { alien: 'right', value: re.ri.toFixed(2) };
    }

    if ('sigmaw' in re && 'sigma12' in re) {
      const str: string = re.sigmaw.toFixed(1) +  '/' +  re.sigma12.toFixed(0);
      result.sigma = { alien: 'center', value: str };
    }

    if ('Ratio' in re) {
      result.Ratio = { alien: 'right', value: re.Ratio.toFixed(3) };
    }
    if ('Result' in re) {
      result.Result = { alien: 'center', value: re.Result };
    }

    return result;
  }
}
