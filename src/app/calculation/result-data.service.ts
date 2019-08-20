import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultDataService {

  public htmlContents: string;

  constructor() {
    this.clear();
  }

  clear(): void {
    this.htmlContents = '';
  }

  // 計算結果情報から 結果HTMLを取得する
  public loadResultData(resultText: string): void {
    try {
      resultText = resultText.slice(1);      // 先頭から1文字を削除
      resultText = resultText.slice(0, -1);  // 末尾から1文字を削除
      resultText = resultText.replace('\n', '');
      resultText = resultText.replace('\r', '');
      this.htmlContents = resultText;
    } catch { }
  }

  // 安全性曲げモーメント
  public safety_moment_pages(): any[] {
    const result: any[] = new Array();

    for ( let i = 0; i < 1; i++) {
      const page = { caption: '安全性(破壊)照査結果', columns: new Array() };

      for ( let c = 0; c < 5; c++ ) {
        const column: any[] = new Array();
        column.push({alien: 'center', value: '1部材(0.600)'});
        column.push({alien: 'center', value: '壁前面(上側)'});
        column.push({alien: 'center', value: '1'});
        column.push({alien: 'right', value: '1000'});
        column.push({alien: 'right', value: '3000'});
        column.push({alien: 'center', value: '-'});
        column.push({alien: 'center', value: '-'});
        column.push({alien: 'right', value: '6353.6'});
        column.push({alien: 'center', value: 'D32-8 本'});
        column.push({alien: 'right', value: '82.0'});
        column.push({alien: 'right', value: '12707.2'});
        column.push({alien: 'center', value: 'D32-16 本'});
        column.push({alien: 'right', value: '114.0'});
        column.push({alien: 'center', value: '-'});
        column.push({alien: 'center', value: ''});
        column.push({alien: 'center', value: '-'});
        column.push({alien: 'right', value: '24.0'});
        column.push({alien: 'right', value: '1.30'});
        column.push({alien: 'right', value: '18.5'});
        column.push({alien: 'right', value: '390'});
        column.push({alien: 'right', value: '1.00'});
        column.push({alien: 'right', value: '390'});
        column.push({alien: 'right', value: '501.7'});
        column.push({alien: 'right', value: '455.2'});
        column.push({alien: 'right', value: '0.00048'});
        column.push({alien: 'right', value: '0.00195'});
        column.push({alien: 'right', value: '572.1'});
        column.push({alien: 'right', value: '7420.2'});
        column.push({alien: 'right', value: '1.00'});
        column.push({alien: 'right', value: '7420.2'});
        column.push({alien: 'right', value: '1.20'});
        column.push({alien: 'right', value: '0.081'});
        column.push({alien: 'center', value: 'OK'});
        page.columns.push(column);
      }
      result.push(page);
    }
    return result;
  }

}
