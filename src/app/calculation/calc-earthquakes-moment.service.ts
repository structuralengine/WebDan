import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';

@Injectable({
  providedIn: 'root'
})
export class CalcEarthquakesMomentService extends CalcRestorabilityMomentService {
  // 復旧性（地震時）曲げモーメント
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
    const result: any[] = this.getRestorabilityPages('復旧性（地震時）曲げモーメントの照査結果');
    return result;
  }
}
