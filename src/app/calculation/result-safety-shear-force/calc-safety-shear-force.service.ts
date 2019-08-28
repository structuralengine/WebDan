import { SaveDataService } from '../../providers/save-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyShearForceService {
  // 安全性（破壊）せん断力
  private DesignForceList: any[];

  constructor(private save: SaveDataService,
              private calc: ResultDataService,
              private base: CalcSafetyMomentService) {
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
    pickupNoList.push(this.save.basic.pickup_moment_no[5]); // ピックアップNoは せん断の5番目に保存されている
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
    
  public setPostData(DesignForceList: any[]): any{
    return this.base.setPostData(DesignForceList);
  }

  // 出力テーブル用の配列にセット
  public getSafetyPages(responseData: any, postData: any, 
      title: string= '安全性（破壊）せん断力の照査結果'): any[] {

    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: title, columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });

        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });
        column.push({ alien: 'right', value: '12707.2' });
        column.push({ alien: 'center', value: 'D32-16 本' });
        column.push({ alien: 'right', value: '114.0' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '506.8' });
        column.push({ alien: 'center', value: 'D32-4 本' });
        column.push({ alien: 'right', value: '345' });
        column.push({ alien: 'right', value: '90' });
        column.push({ alien: 'right', value: '250' });

        column.push({ alien: 'right', value: '0.550' });
        column.push({ alien: 'right', value: '1.117' });
        column.push({ alien: 'right', value: '0.681' });
        column.push({ alien: 'right', value: '503.9' });
        column.push({ alien: 'right', value: '18.1' });
        column.push({ alien: 'right', value: '1.072' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '221.5' });
        column.push({ alien: 'right', value: '1.10' });
        column.push({ alien: 'right', value: '355.5' });
        column.push({ alien: 'right', value: '577.0' });
        column.push({ alien: 'right', value: '1.20' });

        column.push({ alien: 'right', value: '0.210' });
        column.push({ alien: 'center', value: 'OK' });

        column.push({ alien: 'right', value: '5.697' });
        column.push({ alien: 'right', value: '2817.7' });
        column.push({ alien: 'right', value: '0.043' });
        column.push({ alien: 'center', value: 'OK' });

        page.columns.push(column);
      }
      result.push(page);
    }

    return result;
  }
}
