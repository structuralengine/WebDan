import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcDurabilityMomentService extends CalcServiceabilityMomentService {
  // 使用性 曲げひび割れ

  constructor(public save: SaveDataService,
              public calc: ResultDataService) {
    super(save, calc);
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {
    this.DesignForceList = this.calc.getDesignForceList('使用性 曲げひび割れ');

    
    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す

    return result;
  }

  public getDurabilityPages(): any[] {
    const result: any[] = this.getServiceabilityPages('使用性（外観）曲げひび割れの照査結果');
    return result;
  }
}
