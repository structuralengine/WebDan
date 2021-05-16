import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcSafetyFatigueShearForceService } from './calc-safety-fatigue-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { ResultSafetyShearForceComponent } from '../result-safety-shear-force/result-safety-shear-force.component';

@Component({
  selector: 'app-result-safety-fatigue-shear-force',
  templateUrl: './result-safety-fatigue-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})

export class ResultSafetyFatigueShearForceComponent implements OnInit {

  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyFatigueShearForcepages: any[];
  public NA: number; // A列車の回数
  public NB: number; // B列車の回数

  constructor(private http: HttpClient,
              private calc: CalcSafetyFatigueShearForceService,
              private base: ResultSafetyShearForceComponent,
              private post: SetPostDataService,
              private result: ResultDataService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    const trainCount: number[] = this.calc.getTrainCount();
    this.NA = trainCount[0];
    this.NB = trainCount[1];

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }
    if (postData.length < 1) {
      this.isLoading = false;
      this.isFulfilled = false;
      return;
    }

      // 計算結果を集計する
    this.safetyFatigueShearForcepages = this.setSafetyFatiguePages(this.calc.DesignForceList);
    this.isFulfilled = true;
    this.isLoading = false;
    this.calc.isEnable = true;
    
    this.NA = 80;
    this.NB = 80;
  }

  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(postData: any): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i = 0;
    const title = '安全性（疲労破壊）せん断力の照査結果';

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

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();


            /////////////// まず計算 ///////////////

            const resultFatigue: any = this.calc.calcFatigue(PrintData, postdata0, postdata1, position);

            const resultColumn: any = this.getResultString(resultFatigue);

            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata0));
            column.push(this.result.getTitleString3(position, postdata0));

            ///////////////// 形状 /////////////////
            column.push(this.base.getShapeString_B(PrintData));
            column.push(this.base.getShapeString_H(PrintData));
            column.push(resultColumn.tan);
            /////////////// 引張鉄筋 ///////////////
            column.push(resultColumn.As);
            column.push(resultColumn.AsString);
            column.push(resultColumn.dst);
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
            column.push(resultColumn.fwud);
            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Vpd);
            column.push(resultColumn.Mpd);
            column.push(resultColumn.Npd);

            column.push(resultColumn.Vrd);
            column.push(resultColumn.Mrd);
            column.push(resultColumn.Nrd);

            column.push(resultColumn.fvcd);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);

            column.push(resultColumn.kr);

            column.push(resultColumn.sigma_min);
            column.push(resultColumn.sigma_rd);
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

            column.push(resultColumn.rbs);
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
  private getResultString(re: any): any {

    const result = {
      tan: { alien: 'center', value: '-' },

      As: { alien: 'center', value: '-' },
      AsString: { alien: 'center', value: '-' },
      dst: { alien: 'center', value: '-' },

      fwud: { alien: 'center', value: '-' },
      Aw: { alien: 'center', value: '-' },
      AwString: { alien: 'center', value: '-' },
      fwyd: { alien: 'center', value: '-' },
      deg: { alien: 'center', value: '-' },
      Ss: { alien: 'center', value: '-' },

      Vpd: { alien: 'center', value: '-' },
      Mpd: { alien: 'center', value: '-' },
      Npd: { alien: 'center', value: '-' },

      Vrd: { alien: 'center', value: '-' },
      Mrd: { alien: 'center', value: '-' },
      Nrd: { alien: 'center', value: '-' },

      fvcd: { alien: 'center', value: '-' },
      rbc: { alien: 'center', value: '-' },
      Vcd: { alien: 'center', value: '-' },

      kr: { alien: 'center', value: '-' },

      sigma_min: { alien: 'center', value: '-' },
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

      rbs: { alien: 'center', value: '-' },
      ri: { alien: 'center', value: '-' },
      ratio: { alien: 'center', value: '-' },
      result: { alien: 'center', value: '-' }
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

    // 帯鉄筋
    if ('fwud' in re) {
      result.fwud = { alien: 'right', value: re.fwud.toFixed(0) };
    }
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
    if ('Vpd' in re) {
      result.Vpd = { alien: 'right', value: re.Vpd.toFixed(1) };
    }
    if ('Mpd' in re) {
      result.Mpd = { alien: 'right', value: re.Mpd.toFixed(1) };
    }
    if ('Npd' in re) {
      result.Npd = { alien: 'right', value: re.Npd.toFixed(1) };
    }

    if ('Vrd' in re) {
      result.Vrd = { alien: 'right', value: re.Vrd.toFixed(1) };
    }
    if ('Mrd' in re) {
      result.Mrd = { alien: 'right', value: re.Mrd.toFixed(1) };
    }
    if ('Nrd' in re) {
      result.Nrd = { alien: 'right', value: re.Nrd.toFixed(1) };
    }

    // 耐力
    if ('fvcd' in re) {
      result.fvcd = { alien: 'right', value: re.fvcd.toFixed(3) };
    }
    if ('rbc' in re) {
      result.rbc = { alien: 'right', value: re.rbc.toFixed(2) };
    }
    if ('Vcd' in re) {
      result.Vcd = { alien: 'right', value: re.Vcd.toFixed(1) };
    }
    if ('kr' in re) {
      result.kr = { alien: 'right', value: re.kr.toFixed(1) };
    }

    if ('sigma_min' in re) {
      result.sigma_min = { alien: 'right', value: re.sigma_min.toFixed(2) };
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
    if ('rbs' in re) {
      result.rbs = { alien: 'right', value: re.rbs.toFixed(2) };
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
