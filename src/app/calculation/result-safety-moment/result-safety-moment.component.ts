import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { CalcSafetyMomentService } from "./calc-safety-moment.service";
import { SetPostDataService } from "../set-post-data.service";
import { ResultDataService } from "../result-data.service";
import { InputDesignPointsService } from "src/app/components/design-points/design-points.service";
import { SetBarService } from "../set-bar.service";
import { SetSectionService } from "../set-section.service";

@Component({
  selector: "app-result-safety-moment",
  templateUrl: "./result-safety-moment.component.html",
  styleUrls: ["../result-viewer/result-viewer.component.scss"],
})
export class ResultSafetyMomentComponent implements OnInit {
  public isLoading = true;
  public isFulfilled = false;
  public err: string;
  public safetyMomentPages: any[];
  private title = "安全性（破壊）曲げモーメントの照査結果";

  constructor(
    private http: HttpClient,
    private calc: CalcSafetyMomentService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private section: SetSectionService,
    private bar: SetBarService,
    private points: InputDesignPointsService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isFulfilled = false;
    this.err = "";

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

      this.safetyMomentPages = this.setSafetyPages(OutputData);
      return true;
    } catch (e) {
      this.err = e.toString();
      return false;
    }
  }

  // 出力テーブル用の配列にセット
  public setSafetyPages(OutputData: any): any[] {
    const result: any[] = new Array();

    let page: any;

    const groupe = this.points.getGroupeList();
    for (let ig = 0; ig < groupe.length; ig++) {
      const groupeName = this.points.getGroupeName(ig);

      page = {
        caption: this.title,
        g_name: groupeName,
        columns: new Array(),
      };

      const safety = this.calc.getSafetyFactor(groupe[ig][0].g_id);

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
                caption: this.title,
                g_name: groupeName,
                columns: new Array(),
              };
            }

            /////////////// まず計算 ///////////////
            const titleColumn = this.result.getTitleString(member, position, side)
            const shape = this.section.getResult('Md', member, res);
            const Ast: any = this.bar.getResult('Md',shape, res, safety);
            const fck: any = this.section.getFck(safety);

            const resultColumn: any = this.calc.getResultValue(
              res, safety
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
            column.push({ alien: 'right', value: resultColumn.Md.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.Nd.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.εcu.toFixed(5) });
            column.push({ alien: 'right', value: resultColumn.εs.toFixed(5) });
            column.push({ alien: 'right', value: resultColumn.x.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.Mu.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.rb.toFixed(2) });
            column.push({ alien: 'right', value: resultColumn.Mud.toFixed(1) });
            column.push({ alien: 'right', value: resultColumn.ri.toFixed(2) });
            column.push({ alien: 'right', value: resultColumn.ratio.toFixed(3) });
            column.push({ alien: 'center', value: resultColumn.result });

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
}
