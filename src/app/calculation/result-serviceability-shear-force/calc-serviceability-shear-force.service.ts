import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityShearForceService {
  // 耐久性 せん断ひび割れ
  public DesignForceList: any[]; 

  constructor(private save: SaveDataService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcSafetyShearForceService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return new Array();
    }
    // せん断ひび割れ検討判定用
    const DesignForce0 = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[0]);
    // 永久荷重
    const DesignForce1 = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[1]);
    // 変動荷重
    const DesignForce2 = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[2]);


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

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return null;
    }
    // せん断ひび割れ検討判定用
    // せん断ひび割れにの検討における Vcd は １つ目の ピックアップ（永久＋変動）の Mu を使う
    this.DesignForceList = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[0]);
    // 永久荷重
    const DesignForceList2 = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[1]);
    
    if(DesignForceList2.length < 1 || this.DesignForceList.length < 1 ){
      return null;
    }
    
    // 変動荷重
    let DesignForceList3 = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[2]);
    if(DesignForceList3.length < 1){
      DesignForceList3 = this.getLiveload(this.DesignForceList , DesignForceList2);
    }

    // サーバーに送信するデータを作成
    const DesignForceListList = [this.DesignForceList, DesignForceList2, DesignForceList3];
    this.post.setPostData(DesignForceListList);
    // POST 用
    const postData = this.post.getPostData(this.DesignForceList, 0, 'ShearForce', '耐力', DesignForceListList.length);
    return postData;
  }

    // 変動荷重を
    private getLiveload(minDesignForceList: any[], maxDesignForceList: any[]): any[] {

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
  public setServiceabilityPages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    const title: string = '耐久性 せん断ひび割れの照査結果';

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // せん断ひび割れ検討判定用
            const PostData0 = position.PostData0[j];

            // 永久荷重
            let PostData1 = { Vd: 0 }; 
            if ('PostData1' in position) {
              PostData1 = position.PostData1[j]; 
            }

            // 変動荷重
            let PostData2 = { Vd: 0 }; 
            if ('PostData2' in position) {
              PostData2 = position.PostData2[j];  
            }

            // 印刷用データ
            const printData = position.printData[j];
            
            // 解析結果
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            if ('La' in printData) { delete printData.La; } // Vcd を計算するので La は削除する
            const resultVmu: any = this.calcSigma(printData, PostData1, PostData2, resultData, position);
            const resultColumn: any = this.getResultString(resultVmu);

            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, PostData0));
            column.push(this.result.getTitleString3(position));

            ///////////////// 形状 /////////////////
            column.push(resultColumn.B);
            column.push(resultColumn.H);
            column.push(resultColumn.tan);
            /////////////// 引張鉄筋 ///////////////
            column.push(resultColumn.As);
            column.push(resultColumn.AsString);
            column.push(resultColumn.dst);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(printData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(printData, 'Ase');
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(printData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.result.getFskString(printData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.Aw);
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Nd);
            column.push(resultColumn.Vhd);
            column.push(resultColumn.Vpd);
            column.push(resultColumn.Vrd);
            /////////////// せん断耐力 ///////////////
            column.push(resultColumn.fvcd);
            column.push(resultColumn.Bd);
            column.push(resultColumn.pc);
            column.push(resultColumn.Bp);
            column.push(resultColumn.Mu);
            column.push(resultColumn.Mo);
            column.push(resultColumn.Bn);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);
            column.push(resultColumn.Vcd07);
            /////////////// せん断応力度 ///////////////
            column.push(resultColumn.con);
            column.push(resultColumn.kr);
            column.push(resultColumn.ri);
            column.push(resultColumn.sigma);
            column.push(resultColumn.Ratio);
            column.push(resultColumn.Result);

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

  public calcSigma(printData: any, postdata1: any, PostData2: any,
    resultData: any, position: any): any {

    const result: any = this.base.calcVmu(printData, resultData, position);

    let Vpd: number = this.save.toNumber(postdata1.Vd);
    if (Vpd === null) { Vpd = 0; }
    result['Vpd'] = Vpd;

    let Vrd: number = this.save.toNumber(PostData2.Vd);
    if (Vrd === null) { Vrd = result.Vd - Vpd; }
    if (Vrd === 0) { Vrd = result.Vd - Vpd; }
    result['Vrd'] = Vrd;

    let Vcd07: number = 0.7 * result.Vcd;
    result['Vcd07'] = Vcd07;

    if (result.Vd <= Vcd07) {
      result['Result'] = 'OK';
      return result;
    }

    // 環境条件
    let conNum: number = this.save.toNumber(position.memberInfo.con_s);
    if (conNum === null) { conNum = 1; }

    // 制限値
    let sigma12: number = 120;
    switch (conNum) {
      case 1:
        sigma12 = (printData.fwyd !== 235) ? 120 : 100;
        result['con'] = '一般の環境';
        break;
      case 2:
        sigma12 = (printData.fwyd !== 235) ? 100 : 80;
        result['con'] = '腐食性環境';
        break;
      case 3:
        sigma12 = (printData.fwyd !== 235) ? 80 : 60;
        result['con'] = '厳しい腐食';
        break;
    }
    result['sigma12'] = sigma12;

    // せん断補強鉄筋の設計応力度
    let kr: number = this.save.toNumber(position.memberInfo.kr);
    if (kr === null) { kr = 0.5; }
    result['kr'] = kr;

    const VpdVrd_krVcd_s: number = (Vpd + Vrd - kr * result.Vcd) * result.Ss;
    const AwZsinCos: number = result.Aw * result.z * result.sinCos;
    const VpdVcd: number = Vpd + result.Vcd;
    const VpdVrdVcd: number = Vpd + Vrd + result.Vcd;

    const sigmaw = (VpdVrd_krVcd_s / AwZsinCos) * (VpdVcd / VpdVrdVcd);
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

  private getResultString(re: any): any {

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
      const str: string = re.sigmaw.toFixed(0) +  '/' +  re.sigma12.toFixed(0);
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
