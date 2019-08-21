import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';

@Injectable({
  providedIn: 'root'
})
export class CalcServiceabilityShearForceService {
  // 耐久性 せん断ひび割れ
  private DesignForceList: any[];
  
  constructor(private save: SaveDataService,
              private calc: ResultDataService) { }

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

  public getServiceabilityPages(): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: '耐久性 せん断ひび割れの照査結果', columns: new Array() };

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

        column.push({ alien: 'right', value: '506.8' });
        column.push({ alien: 'center', value: 'D32-4 本' });
        column.push({ alien: 'right', value: '345' });
        column.push({ alien: 'right', value: '90' });
        column.push({ alien: 'right', value: '250' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '455.2' });

        column.push({ alien: 'right', value: '0.550' });
        column.push({ alien: 'right', value: '1.117' });
        column.push({ alien: 'right', value: '0.00315' });
        column.push({ alien: 'right', value: '0.681' });
        column.push({ alien: 'right', value: '503.9' });
        column.push({ alien: 'right', value: '18.1' });
        column.push({ alien: 'right', value: '1.072' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '503.9' });
        column.push({ alien: 'center', value: '89.3 < 215.6' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: 'OK' });

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
