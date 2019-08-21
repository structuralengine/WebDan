import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcRestorabilityShearForceService extends CalcSafetyShearForceService {
  // 復旧性（地震時以外）せん断力

  constructor(public save: SaveDataService,
              public calc: ResultDataService) {
    super(save, calc);
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {
    this.DesignForceList = this.calc.getDesignForceList('復旧性（地震時以外）せん断力');


    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      return result;
    }

    return result;
  }

  public getRestorabilityPages(): any[] {
    const result: any[] = this.getSafetyPages('復旧性（地震時以外）せん断力の照査結果');
    return result;
  }
}
