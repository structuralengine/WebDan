import { SaveDataService } from '../../providers/save-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcRestorabilityMomentService } from '../result-restorability-moment/calc-restorability-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcEarthquakesMomentService {
  // 復旧性（地震時）曲げモーメント
  public DesignForceList: any[];

  constructor(private save: SaveDataService,
              private calc: ResultDataService,
              private base: CalcRestorabilityMomentService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      this.DesignForceList = new Array();
      return new Array();
    }

    const pickupNoList: any[] = new Array();
    pickupNoList.push(this.save.basic.pickup_moment_no[9]); // ピックアップNoは 曲げの9番目に保存されている
    this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);

    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    if (this.save.calc.print_selected.print_section_force_checked === false) {
      return result;
    }

    // ToDo: ここで、断面力テーブル用のデータを 変数 result に構築する

    return result;
  }

  // サーバー POST用データを生成する
  public getPostData(): any {

    // 断面力のエラーチェック
    if (this.DesignForceList === null) {
      this.setDesignForces();
    }
    if (this.DesignForceList.length < 1) {
      this.setDesignForces();
      if (this.DesignForceList.length < 1) {
        // Error!! - 計算対象がありません
        return null;
      }
    }

    // サーバーに送信するデータを作成
    const postData = this.setPostData(this.DesignForceList);
    return postData;
  }
  
  private setPostData(DesignForceList: any[]): any{
    return this.base.setPostData(DesignForceList);
  }

  // 出力テーブル用の配列にセット
  public setEarthquakesPages(responseData: any, postData: any): any[] {
    const result: any[] = this.base.setRestorabilityPages(responseData, postData, '復旧性（地震時）曲げモーメントの照査結果');
    return result;
  }
}
