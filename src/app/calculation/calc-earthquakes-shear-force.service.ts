import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';

@Injectable({
  providedIn: 'root'
})
export class CalcEarthquakesShearForceService extends CalcSafetyShearForceService {
  // 復旧性（地震時）せん断力
  private DesignForceList: any[];
  
  constructor(public save: SaveDataService,
              public calc: ResultDataService) {
    super(save, calc);
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {
    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      return result;
    }

    return result;
  }

  public getEarthquakesPages(): any[] {
    const result: any[] = this.getSafetyPages('復旧性（地震時以外）せん断力の照査結果');
    return result;
  }
}
