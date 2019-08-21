import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcRestorabilityMomentService {
  // 復旧性（地震時以外）曲げモーメント

  constructor() { }

  public restorability_moment_pages(title = '復旧性（地震時以外）曲げモーメントの照査結果'): any[] {
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
        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '0.00048' });
        column.push({ alien: 'right', value: '0.00195' });
        column.push({ alien: 'right', value: '572.1' });
        column.push({ alien: 'right', value: '7420.2' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '7420.2' });
        column.push({ alien: 'right', value: '1.20' });
        column.push({ alien: 'right', value: '0.081' });
        column.push({ alien: 'center', value: 'OK' });
        page.columns.push(column);
      }
      result.push(page);
    }
    return result;
  }
}
