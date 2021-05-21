import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { InputDesignPointsService } from 'src/app/components/design-points/design-points.service';


@Component({
  selector: 'app-result-restorability-moment',
  templateUrl: './result-restorability-moment.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class ResultRestorabilityMomentComponent implements OnInit {

  public title = "復旧性（地震時以外）曲げモーメントの照査";
  public page_index = "ap_8";
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public restorabilityMomentPages: any[];

  constructor(
    private http: HttpClient,
    private calc: CalcRestorabilityMomentService,
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
    console.log(this.title, postData);
    const inputJson: string = this.post.getInputJsonString(postData);
    this.http.post(this.post.URL, inputJson, this.post.options).subscribe(
      (response) => {
        if (response["ErrorException"] === null) {
          this.isFulfilled = this.setPages(response["OutputData"]);
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
  private setPages(OutputData: any): boolean {
    try {
      this.restorabilityMomentPages = this.setRestorabilityPages(OutputData);
      return true;
    } catch(e) {
      this.err = e.toString();
      return false;
    }
  }


  // 出力テーブル用の配列にセット
  public setRestorabilityPages( OutputData: any,
                                title: string = '復旧性（地震時以外）曲げモーメントの照査結果',
                                DesignForceList: any = this.calc.DesignForceList,
                                safetyID = this.calc.safetyID ): any[] {
    const result: any[] = new Array();
    let page: any;

    let i: number = 0;
    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {

      const groupeName = this.points.getGroupeName(ig);
      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id, safetyID);

      for (const member of groupe[ig]) {0
        for (const position of member.positions) {
          for (const side of ["上側引張", "下側引張"]) {

            const res = OutputData.find(
              (e) => e.index === position.index && e.side === side
            );
            if (res === undefined) {
              continue;
            }

            const resultColumn: any = this.calc.getResultValue(
              res, safety, DesignForceList
            );

            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: title,
                g_name: groupeName,
                columns: new Array()
              };
            }
            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            const shapeString = this.result.getShapeString('Md', member, res);
            column.push(shapeString.B);
            column.push(shapeString.H);
            column.push(shapeString.Bt);
            column.push(shapeString.t);
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString('Md', shapeString.shape, res, safety);
            column.push(Ast.Ast);
            column.push(Ast.AstString);
            column.push(Ast.dst);
            /////////////// 圧縮鉄筋 ///////////////
            column.push(Ast.Asc);
            column.push(Ast.AscString);
            column.push(Ast.dsc);
            /////////////// 側面鉄筋 ///////////////
            column.push(Ast.Ase);
            column.push(Ast.AseString);
            column.push(Ast.dse);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(safety);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            column.push(Ast.fsy);
            column.push(Ast.rs);
            column.push(Ast.fsd);
            /////////////// 照査 ///////////////
            column.push({ alien: 'right', value: Math.abs(resultColumn.Md).toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.Nd.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.εcu.toFixed(5) });
            column.push({ alien: 'right', value: resultColumn.εs.toFixed(5) });
            column.push({ alien: 'right', value: resultColumn.x.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.My.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.rb.toFixed(2) });
            column.push({ alien: 'right', value: resultColumn.Myd.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.ri.toFixed(2) });
            column.push({ alien: 'right', value: resultColumn.ratio.toFixed(3) });
            column.push({ alien: 'center', value: resultColumn.result });

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

}

