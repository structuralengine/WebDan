import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetSectionService } from '../set-section.service';
import { SetSafetyFactorService } from '../set-safety-factor.service';
import { ResultDataService } from '../result-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service'

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcServiceabilityMomentService {
  // 耐久性 曲げひび割れ
  public DesignForceList: any[];

  constructor(private save: SaveDataService,
    private force: SetDesignForceService,
    private sectin: SetSectionService,
    private safety: SetSafetyFactorService,
              private result: ResultDataService,
              public base: CalcSafetyMomentService) {
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
    pickupNoList.push(this.save.basic.pickup_moment_no[0]); // 縁応力度検討用
    pickupNoList.push(this.save.basic.pickup_moment_no[1]); // 鉄筋応力度検討用
    pickupNoList.push(this.save.basic.pickup_moment_no[2]); // 永久荷重
    if (this.save.basic.pickup_moment_no[3] !== null) {
      pickupNoList.push(this.save.basic.pickup_moment_no[3]); // 変動荷重
    }
    this.DesignForceList = this.force.getDesignForceList('Moment', pickupNoList);

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

}
