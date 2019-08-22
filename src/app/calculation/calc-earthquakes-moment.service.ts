import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcEarthquakesMomentService {
  // 復旧性（地震時）曲げモーメント
  private DesignForceList: any[];

  constructor(private save: SaveDataService,
    private calc: ResultDataService,
    private base: CalcRestorabilityMomentService) {
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

  public getEarthquakesPages(): any[] {
    // 出力テーブル用のデータにセット
    const result: any[] = this.setEarthquakesPages();
    return result;
  }

  private setEarthquakesPages(): any[] {
    const result: any[] = this.base.getRestorabilityPages('復旧性（地震時）曲げモーメントの照査結果');
    return result;
  }
}
