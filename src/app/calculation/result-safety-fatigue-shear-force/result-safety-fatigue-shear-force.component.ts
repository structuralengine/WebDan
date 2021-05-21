import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcSafetyFatigueShearForceService } from './calc-safety-fatigue-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { ResultSafetyShearForceComponent } from '../result-safety-shear-force/result-safety-shear-force.component';
import { InputDesignPointsService } from 'src/app/components/design-points/design-points.service';

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
              private result: ResultDataService,
              private points: InputDesignPointsService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    const trainCount: number[] = this.calc.getTrainCount();
    this.NA = trainCount[0];
    this.NB = trainCount[1];

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      return;
    }

    // 計算結果を集計する
    try {
      this.safetyFatigueShearForcepages = this.setSafetyFatiguePages(postData);
      this.isFulfilled = true;
      this.calc.isEnable = true;
    } catch (e) {
      this.err = e.toString();
      this.isFulfilled = false;
    }
    this.isLoading = false;
    
  }

  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(OutputData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    const title = '安全性（疲労破壊）せん断力の照査結果';

    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {

      const groupeName = this.points.getGroupeName(ig);
      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);

      for (const member of groupe[ig]) {0
        for (const position of member.positions) {
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.find(
              (e) => e.index === position.index && e.side === side
            );
            if (res === undefined || res.length < 1) {
              continue;
            }

            if (page.columns.length > 4) {
              result.push(page);
              page = { 
                caption: title, 
                g_name: groupeName, 
                columns: new Array() 
              };
            }

            /////////////// まず計算 ///////////////
            const resultColumn: any = this.getResultString(
              this.calc.calcFatigue( res,  position));

            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            const shapeString = this.result.getShapeString('Vd', member, res);
            column.push(shapeString.B);
            column.push(shapeString.H);
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString('Vd', shapeString.shape, res, safety);
            column.push(Ast.tan);
            column.push(Ast.Ast);
            column.push(Ast.AstString);
            column.push(Ast.dst);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(safety);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            column.push(Ast.fsy);
            column.push(Ast.rs);
            column.push(Ast.fsd);
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
