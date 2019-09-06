import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { ResultDataService } from '../result-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyMomentService {
  // 安全性（破壊）曲げモーメント
  public DesignForceList: any[];

  constructor(
    private save: SaveDataService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return new Array();
    }
    const DesignForce = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[4]);

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

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return null;
    }
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[4]);

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList]);
    // POST 用
    const postData = this.post.getPostData(this.DesignForceList, 2, 'Moment', '耐力', 1);
    return postData;
  }



  // 出力テーブル用の配列にセット
  public setSafetyPages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i: number = 0;
    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = {
        caption: '安全性（破壊）曲げモーメントの照査結果',
        g_name: groupeName,
        columns: new Array()
      };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {
            const postdata = position.PostData0[j];
            const printData = position.printData[j];
            const resultData = responseData[i].Reactions[0];

            if (page.columns.length > 4) {
              result.push(page);
              page = {
                caption: '安全性（破壊）曲げモーメントの照査結果',
                g_name: groupeName,
                columns: new Array()
              };
            }
            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata));
            column.push(this.result.getTitleString3(position));
            ///////////////// 形状 /////////////////
            column.push(this.result.getShapeString_B(printData));
            column.push(this.result.getShapeString_H(printData));
            column.push(this.result.getShapeString_Bt(printData));
            column.push(this.result.getShapeString_t(printData));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.result.getAsString(printData);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.ds);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.result.getAsString(printData, 'Asc');
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.ds);
            /////////////// 側面鉄筋 ///////////////
            const Ase: any = this.result.getAsString(printData, 'Ase');
            column.push(Ase.As);
            column.push(Ase.AsString);
            column.push(Ase.ds);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(printData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋情報 ///////////////
            const fsk: any = this.result.getFskString(printData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            /////////////// 照査 ///////////////
            const resultColumn: any = this.getResultString(printData, resultData, position.safety_factor);
            column.push(resultColumn.Md);
            column.push(resultColumn.Nd);
            column.push(resultColumn.εcu);
            column.push(resultColumn.εs);
            column.push(resultColumn.x);
            column.push(resultColumn.Mu);
            column.push(resultColumn.rb);
            column.push(resultColumn.Mud);
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

  private getResultString(printData: any, resultData: any, safety_factor: any): any {

    const Md: number = printData.Md;
    const Mu: number = resultData.M.Mi;
    const rb: number = safety_factor.rb;
    const Mud: number = Mu / rb;
    const ri: number = safety_factor.ri;
    const ratio: number = Math.abs(ri * Md / Mud);
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Md: { alien: 'right', value: Md.toFixed(1) },
      Nd: { alien: 'right', value: printData.Nd.toFixed(1) },
      εcu: { alien: 'right', value: resultData.M.εc.toFixed(5) },
      εs: { alien: 'right', value: resultData.M.εs.toFixed(5) },
      x: { alien: 'right', value: resultData.M.x.toFixed(1) },
      Mu: { alien: 'right', value: Mu.toFixed(1) },
      rb: { alien: 'right', value: rb.toFixed(2) },
      Mud: { alien: 'right', value: Mud.toFixed(1) },
      ri: { alien: 'right', value: ri.toFixed(2) },
      ratio: { alien: 'right', value: ratio.toFixed(3) },
      result: { alien: 'center', value: result }
    };
  }
}

