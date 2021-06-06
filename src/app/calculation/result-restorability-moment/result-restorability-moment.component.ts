import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { InputDesignPointsService } from 'src/app/components/design-points/design-points.service';
import { SetBarService } from '../set-bar.service';
import { SetSectionService } from '../set-section.service';
import { CalcSummaryTableService } from '../result-summary-table/calc-summary-table.service';


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
  public restorabilityMomentPages: any[] = new Array();

  constructor(
    private http: HttpClient,
    private calc: CalcRestorabilityMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private section: SetSectionService,
    private bar: SetBarService,
    private points: InputDesignPointsService,
    private summary: CalcSummaryTableService 
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = '';

    // POST 用データを取得する
    const postData = this.calc.setInputData();
    if (postData === null || postData.length < 1) {
      this.isLoading = false;
      this.summary.setSummaryTable("restorabilityMoment");
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
        this.summary.setSummaryTable("restorabilityMoment", this.restorabilityMomentPages);
      },
      (error) => {
        this.err = 'error!!' + '\n'; 
        let e: any = error;
        while('error' in e) {
          if('message' in e){ this.err += e.message + '\n'; }
          if('text' in e){ this.err += e.text + '\n'; }
          e = e.error;
        }
        if('message' in e){ this.err += e.message + '\n'; }
        if('stack' in e){ this.err += e.stack; }

        this.isLoading = false;
        this.summary.setSummaryTable("restorabilityMoment");
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

    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {

      const groupeName = this.points.getGroupeName(ig);
      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id, safetyID);

      for (const member of groupe[ig]) {
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
            const titleColumn = this.result.getTitleString(member, position, side)
            const shape = this.section.getResult('Md', member, res);
            const Ast: any = this.bar.getResult('Md', shape, res, safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.calc.getResultValue(
              res, safety, DesignForceList
            );


            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push({ alien: 'center', value: titleColumn.m_no });
            column.push({ alien: 'center', value: titleColumn.p_name });
            column.push({ alien: 'center', value: titleColumn.side });
            ///////////////// 形状 /////////////////
            column.push(this.result.alien(shape.B));
            column.push(this.result.alien(shape.H));
            column.push(this.result.alien(shape.Bt));
            column.push(this.result.alien(shape.t));
            /////////////// 引張鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ast), 'center'));
            column.push(this.result.alien(Ast.AstString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dst), 'center'));
            /////////////// 圧縮鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Asc), 'center'));
            column.push(this.result.alien(Ast.AscString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dsc), 'center'));
            /////////////// 側面鉄筋 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.Ase), 'center'));
            column.push(this.result.alien(Ast.AseString, 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.dse), 'center'));
            /////////////// コンクリート情報 ///////////////
            column.push(this.result.alien(fck.fck.toFixed(1), 'center'));
            column.push(this.result.alien(fck.rc.toFixed(2), 'center'));
            column.push(this.result.alien(fck.fcd.toFixed(1), 'center'));
            /////////////// 鉄筋情報 ///////////////
            column.push(this.result.alien(this.result.numStr(Ast.fsy, 1), 'center'));
            column.push(this.result.alien(Ast.rs.toFixed(2), 'center'));
            column.push(this.result.alien(this.result.numStr(Ast.fsd, 1), 'center'));
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

            /////////////// 総括表用 ///////////////
            column.push(position.index);
            column.push(side);
            column.push(shape.shape);

            page.columns.push(column);
          }
        }
      }
      // 最後のページ
      if (page.columns.length > 0) {
        for(let i=page.columns.length; i<5; i++){
          const column: any[] = new Array();
          for(let j=0; j<page.columns[0].length-3; j++){
            column.push({alien: 'center', value: '-'});
          }
          column.push(null);//position.index);
          column.push(null);//side);
          column.push(null);//shape.shape);
          page.columns.push(column);
        }
        result.push(page);
      }
    }
    return result;
  }

}

