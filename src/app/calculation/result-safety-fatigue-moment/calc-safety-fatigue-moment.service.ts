import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetFatigueService } from '../set-fatigue.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';

import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueMomentService {
  // 安全性（疲労破壊）曲げモーメント
  public DesignForceList: any[];
  // 永久作用と縁応力検討用のポストデータの数を調べるのに使う
  private PostedData: any;

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private fatigue: SetFatigueService,
              private post: SetPostDataService,
              private result: ResultDataService
    ) {
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
    // 最小応力
    const DesignForce0 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[2]);
    // 最大応力
    const DesignForce1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[3]);

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
    // 最小応力
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[2]);
    // 最大応力
    const DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[3]);
    // 変動応力
    const DesignForceList2 = this.getLiveload(this.DesignForceList, DesignForceList1);

    // サーバーに送信するデータを作成
    const DesignForceListList = [this.DesignForceList, DesignForceList2];
    this.post.setPostData(DesignForceListList);
    this.PostedData = this.post.getPostData(this.DesignForceList, 1, 'Moment', '応力度', DesignForceListList.length);
    // POST 用 連結する
    const postData = {
      InputData0: this.copyInputData(this.PostedData.InputData0, this.PostedData.InputData1)
    };
    return postData;
  }

  // POST データを結合する
  private copyInputData(InputData0: any[], InputData1: any[]): any[] {
    for (let i = 0; i < InputData0.length; i++) {
      for (const key of Object.keys(InputData0[i])) {
        if (key in InputData1[i] === false) {
          InputData1[i][key] = InputData0[i][key];
        }
      }
    }
    const result = InputData0.concat(InputData1);
    return result;
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
          // position に 疲労係数入れる
          this.fatigue.setFatigueData(member.g_no, member.m_no, position);
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
  public setSafetyFatiguePages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();

    let page: any;
    let groupeName: string;
    let i: number = 0;
    const title: string = '安全性（疲労破壊）曲げモーメントの照査結果';

    const responseMin = responseData.slice(0, this.PostedData.InputData0.length);
    const responseMax = responseData.slice(-this.PostedData.InputData1.length);

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 最小応力
            const postdata = position.PostData0[j];

            // 印刷用データ
            const printData = position.printData[j];

            // 応力度
            const resultMin = responseMin[i].ResultSigma;
            const resultMax = responseMax[i].ResultSigma;

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();
            
            /////////////// まず計算 ///////////////
            //const resultWd: any = this.calcWd(printData, postdata, liveLoad, position, resultData, isDurability);
            //const resultColumn: any = this.getResultString(resultWd);

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
            column.push(fsk.fsu);
            /////////////// 照査 ///////////////
            column.push({ alien: 'right', value: '501.7' });
            column.push({ alien: 'right', value: '455.2' });
            column.push({ alien: 'right', value: '0' });

            column.push({ alien: 'right', value: '501.7' });
            column.push({ alien: 'right', value: '455.2' });
            column.push({ alien: 'right', value: '44.18' });

            column.push({ alien: 'right', value: '172.86' });
            column.push({ alien: 'right', value: '0.309' });
            column.push({ alien: 'right', value: '0.06' });
            column.push({ alien: 'right', value: '2.635' });
            column.push({ alien: 'right', value: '2689700' });
            column.push({ alien: 'right', value: '8.63' });
            column.push({ alien: 'right', value: '42.10' });
            column.push({ alien: 'right', value: '0.720' });
            column.push({ alien: 'right', value: '0.898' });
            column.push({ alien: 'right', value: '1.00' });
            column.push({ alien: 'right', value: '1.000' });
            column.push({ alien: 'right', value: '1.05' });
            column.push({ alien: 'right', value: '169.06' });
            column.push({ alien: 'right', value: '1.10' });

            column.push({ alien: 'right', value: '0.210' });
            column.push({ alien: 'center', value: 'OK' });

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
