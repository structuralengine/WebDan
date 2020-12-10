import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcRestorabilityMomentService {
  // 復旧性（地震時以外）曲げモーメント
  public DesignForceList: any[];
  public isEnable: boolean;

  constructor(
    private save: SaveDataService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    public base: CalcSafetyMomentService) {
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): void{

    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return;
    }

    this.DesignForceList = this.force.getDesignForceList('Md', this.save.basic.pickup_moment_no[6]);

    if (this.DesignForceList.length < 1 ) {
      return;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList], 'Md');

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if(this.DesignForceList.length < 1 ){
      return null;
    }

    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 3, 'Md', '耐力', 1);
    return postData;
  }


  // 出力テーブル用の配列にセット
  public setRestorabilityPages(responseData: any,
    postData: any,
    title: string = '復旧性（地震時以外）曲げモーメントの照査結果'
  ): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = {
        caption: title,
        g_name: groupeName,
        columns: new Array()
      };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {
            const postdata = position.PostData0[j];
            const PrintData = position.PrintData[j];
            const resultData = responseData[i].Reactions[0];

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
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position, postdata));
            ///////////////// 形状 /////////////////
            column.push(this.result.getShapeString_B(PrintData));
            column.push(this.result.getShapeString_H(PrintData));
            column.push(this.result.getShapeString_Bt(PrintData));
            column.push(this.result.getShapeString_t(PrintData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(PrintData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(PrintData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(PrintData, 'Ase');
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 照査 ///////////////
            const resultColumn: any = this.getResultString(PrintData, resultData, position.safety_factor);
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.εcu);
            column.push(resultColumn.εs);
            column.push(resultColumn.x);
            column.push(resultColumn.My);
            column.push(resultColumn.rb);
            column.push(resultColumn.Myd);
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

  private getResultString(PrintData: any, resultData: any, safety_factor: any): any {

    const Md: number = Math.abs(PrintData.Md);
    const My: number = resultData.Y.Mi;
    const rb: number = safety_factor.rb;
    const Myd: number = My / rb;
    const ri: number = safety_factor.ri;
    const ratio: number = ri * Md / Myd;
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Md: { alien: 'right', value: Md.toFixed(1) },
      Nd: { alien: 'right', value: PrintData.Nd.toFixed(1) },
      εcu: { alien: 'right', value: resultData.Y.εc.toFixed(5) },
      εs: { alien: 'right', value: resultData.Y.εs.toFixed(5) },
      x: { alien: 'right', value: resultData.Y.x.toFixed(1) },
      My: { alien: 'right', value: My.toFixed(1) },
      rb: { alien: 'right', value: rb.toFixed(2) },
      Myd: { alien: 'right', value: Myd.toFixed(1) },
      ri: { alien: 'right', value: ri.toFixed(2) },
      ratio: { alien: 'right', value: ratio.toFixed(3) },
      result: { alien: 'center', value: result }
    };
  }
}
