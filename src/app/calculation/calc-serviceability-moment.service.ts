import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';

@Injectable({
  providedIn: 'root'
})
export class CalcServiceabilityMomentService {
  // 耐久性 曲げひび割れ
  private DesignForceList: any[];
  
  constructor(public save: SaveDataService,
              public calc: ResultDataService) { }

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

  public getServiceabilityPages(title = '耐久性 曲げひび割れの照査結果'): any[] {
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
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });
        column.push({ alien: 'right', value: '12707.2' });
        column.push({ alien: 'center', value: 'D32-16 本' });
        column.push({ alien: 'right', value: '114.0' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'center', value: '一般の環境' });

        column.push({ alien: 'right', value: '80.9' });
        column.push({ alien: 'right', value: '112.9' });
        column.push({ alien: 'center', value: '0.52 < 2.59' });

        column.push({ alien: 'right', value: '44.7' });
        column.push({ alien: 'right', value: '97.2' });
        column.push({ alien: 'center', value: '0.76 < 10.8' });
        column.push({ alien: 'center', value: '9.1 < 140' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: 'OK' });

        page.columns.push(column);
      }
      result.push(page);
    }

    return result;
  }
  
}
