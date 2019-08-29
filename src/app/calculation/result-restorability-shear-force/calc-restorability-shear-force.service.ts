import { SaveDataService } from '../../providers/save-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcRestorabilityShearForceService {
  // 復旧性（地震時以外）せん断力
  public DesignForceList: any[];

  constructor(private save: SaveDataService,
              private calc: ResultDataService,
              private base: CalcSafetyShearForceService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      this.DesignForceList = new Array();
      return new Array();
    }

    const pickupNoList: any[] = new Array();
    pickupNoList.push(this.save.basic.pickup_moment_no[6]); // ピックアップNoは せん断の6番目に保存されている
    this.DesignForceList = this.calc.getDesignForceList('ShearForce', pickupNoList);

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
  public setRestorabilityPages(responseData: any, postData: any): any[] {
    const result: any[] = this.base.getSafetyPages(responseData, postData, '復旧性（地震時以外）せん断力の照査結果');
    return result;
  }
}
