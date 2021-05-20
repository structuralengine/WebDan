import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalcServiceabilityShearForceService } from './calc-serviceability-shear-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { ResultSafetyShearForceComponent } from '../result-safety-shear-force/result-safety-shear-force.component';
import { InputDesignPointsService } from 'src/app/components/design-points/design-points.service';


@Component({
  selector: 'app-result-serviceability-shear-force',
  templateUrl: './result-serviceability-shear-force.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultServiceabilityShearForceComponent implements OnInit {

  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public serviceabilityShearForcePages: any[];

  constructor(private http: HttpClient,
              private calc: CalcServiceabilityShearForceService,
              private base: ResultSafetyShearForceComponent,
              private post: SetPostDataService,
              private result: ResultDataService,
              private points: InputDesignPointsService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      return;
    }

    // postする
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, this.post.options).subscribe(
      (response) => {
        if (response["ErrorException"] === null) {
          this.isFulfilled = this.setPages(postData, response["OutputData"]);
          this.calc.isEnable = true;
        } else {    
          this.err = JSON.stringify(response["ErrorException"]);
        }
        this.isLoading = false;
      },
      (error) => {
        this.err = error.toString();
        this.isLoading = false;
      }
    );

  }

  // 計算結果を集計する
  private setPages(postData: any, OutputData: any): boolean {
    try {
      this.serviceabilityShearForcePages = this.setServiceabilityPages(postData, OutputData);
      return true;
    } catch(e) {
      this.err = e.toString();
      return false;
    }
  }


  // 出力テーブル用の配列にセット
  public setServiceabilityPages(postData: any, OutputData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    const title: string = '耐久性 せん断ひび割れの照査結果';

    let i: number = 0;
    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {
      const groupeName = this.points.getGroupeName(ig);
      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array(),
      };

      for (const member of groupe[ig]) {0
        for (const position of member.positions) {
          for (const side of ["上側引張", "下側引張"]) {

            const post = postData.filter(
              (e) => e.index === position.index && e.side === side
            );
            const res = OutputData.filter(
              (e) => e.index === position.index && e.side === side
            );
            if (post === undefined || res === undefined) {
              continue;
            }

            // せん断ひび割れ検討判定用
            const PostData0 = post[0];

            // 永久荷重
            const PostData1 = post[1];

            // 変動荷重
            const PostData2 = post[2];

            // 解析結果
            const resultData = res[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = { 
                caption: title, 
                g_name: groupeName,
                columns: new Array() 
              };
            }

            const column: any[] = new Array();

            /////////////// まず計算 ///////////////
            const resultColumn: any = this.getResultString(
              this.calc.calcSigma(
                null, 
                PostData1, 
                PostData2, 
                resultData, 
                position
            ));

            /////////////// タイトル ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            const shapeString = this.result.getShapeString('Md', member, post);
            column.push(shapeString.B);
            column.push(shapeString.H);
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(position.shape, member, position);
            column.push(Ast.tan);
            column.push(Ast.Ast);
            column.push(Ast.AstString);
            column.push(Ast.dst);
            /////////////// 圧縮鉄筋 ///////////////
            column.push(Ast.Asc);
            column.push(Ast.AscString);
            column.push(Ast.dsc);
            /////////////// 側面鉄筋 ///////////////
            // column.push(Ast.Ase);
            column.push(Ast.AseString);
            column.push(Ast.dse);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(position);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.result.getFskString(position);
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
