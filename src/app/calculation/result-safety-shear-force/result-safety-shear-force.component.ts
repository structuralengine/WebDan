import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';


@Component({
  selector: 'app-result-safety-shear-force',
  templateUrl: './result-safety-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultSafetyShearForceComponent implements OnInit {

  private isLoading = true;
  private isFulfilled = false;
  private err: string;
  private safetyShearForcePages: any[];

  constructor(private http: Http,
    private calc: CalcSafetyShearForceService,
    private result: ResultDataService,
    private post: SetPostDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.calc.getPostData();
    if (postData === null) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }
    if (postData.InputData.length < 1) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }

    // postする
    const inputJson: string = '=' + JSON.stringify(postData);
    this.http.post(this.post.URL, inputJson, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
      .subscribe(
        response => {
          const result: string = response.text();
          this.isFulfilled = this.setPages(result, this.calc.DesignForceList);
          this.isLoading = false;
        },
        error => {
          this.err = error.toString();
          this.isLoading = false;
          this.isFulfilled = false;
        });

  }

  // 計算結果を集計する
  private setPages(response: string, postData: any): boolean {
    if (response === null) {
      return false;
    }
    if (response.slice(0, 7).indexOf('Error') >= 0) {
      this.err = response;
      return false;
    }
    const json = this.post.parseJsonString(response);
    if (json === null) { return false; }
    this.safetyShearForcePages = this.getSafetyPages(json.OutputData, postData);
    return true;
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

            /////////////// まず計算 ///////////////
            const resultVmu: any = this.calc.calcVmu(printData, resultData, position);
            const resultColumn: any = this.getResultString(resultVmu);
            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
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

  private getResultString(re: any): any {

    const result = {
      B: { alien: 'center', value: '-' },
      H: { alien: 'center', value: '-' },
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

}
