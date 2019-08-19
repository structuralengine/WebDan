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
    const pages = { 'caption': '安全性(破壊)照査結果', 'tables': new Array() };
    const rows: any[] = new Array();
    let column: any[];

    const column_count = 6;

    for ( let i = 0; i < 1; i++) {

      // タイトル列
      column = new Array();
      column.push('');
      for ( let c = 1; c < column_count; c++) {
        column.push('左支点上側');
      }
      rows.push(column);

      // 照査位置
      column = new Array();
      column.push('照査位置');
      for ( let c = 1; c < column_count; c++) {
        column.push('1部材');
      }
      rows.push(column);

      // 断面番号
      column = new Array();
      column.push('断面番号');
      for ( let c = 1; c < column_count; c++) {
        column.push('1');
      }
      rows.push(column);

      // 断面高さ
      column = new Array();
      column.push('H (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('1600');
      }
      rows.push(column);

      // フランジ高さ
      column = new Array();
      column.push('Hf (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('-');
      }
      rows.push(column);

      // フランジ幅
      column = new Array();
      column.push('Bf (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('-');
      }
      rows.push(column);

      // 断面幅
      column = new Array();
      column.push('B (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('750');
      }
      rows.push(column);

      // 引張鉄筋
      column = new Array();
      column.push('Ast');
      for ( let c = 1; c < column_count; c++) {
        column.push('D32-4');
      }
      rows.push(column);

      // 引張鉄筋量
      column = new Array();
      column.push('(mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('4765.2');
      }
      rows.push(column);

      // 引張鉄筋かぶり
      column = new Array();
      column.push('dast (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('59.0');
      }
      rows.push(column);

      // 圧縮鉄筋
      column = new Array();
      column.push('Asc');
      for ( let c = 1; c < column_count; c++) {
        column.push('D32-4');
      }
      rows.push(column);

      // 圧縮鉄筋量
      column = new Array();
      column.push('(mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('4765.2');
      }
      rows.push(column);

      // 圧縮鉄筋かぶり
      column = new Array();
      column.push('dasc (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('59.0');
      }
      rows.push(column);

      // 側面鉄筋
      column = new Array();
      column.push('Ase');
      for ( let c = 1; c < column_count; c++) {
        column.push('D16-4');
      }
      rows.push(column);

      // 側面鉄筋量
      column = new Array();
      column.push('(mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('4765.2');
      }
      rows.push(column);

      // コンクリート強度
      column = new Array();
      column.push('fck (N/mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('27');
      }
      rows.push(column);

      // 材料係数
      column = new Array();
      column.push('γc');
      for ( let c = 1; c < column_count; c++) {
        column.push('1.3');
      }
      rows.push(column);

      // 設計コンクリート強度
      column = new Array();
      column.push('fcd (N/mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('20.8');
      }
      rows.push(column);

      // 鉄筋強度
      column = new Array();
      column.push('fsyk (N/mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('345');
      }
      rows.push(column);

      // 材料係数
      column = new Array();
      column.push('γs');
      for ( let c = 1; c < column_count; c++) {
        column.push('1.0');
      }
      rows.push(column);

      // 設計鉄筋強度
      column = new Array();
      column.push('fsyd (N/mm2)');
      for ( let c = 1; c < column_count; c++) {
        column.push('345');
      }
      rows.push(column);

      // 設計曲げモーメント
      column = new Array();
      column.push('Md (kN・m)');
      for ( let c = 1; c < column_count; c++) {
        column.push('1167.2');
      }
      rows.push(column);

      // 設計軸方向力
      column = new Array();
      column.push('Nd (kN)');
      for ( let c = 1; c < column_count; c++) {
        column.push('568.4');
      }
      rows.push(column);

      // コンクリートの終局ひずみ
      column = new Array();
      column.push("ε'cu");
      for ( let c = 1; c < column_count; c++) {
        column.push('0.00350');
      }
      rows.push(column);

      // 鉄筋のひずみ
      column = new Array();
      column.push('εs');
      for ( let c = 1; c < column_count; c++) {
        column.push('0.07258');
      }
      rows.push(column);

      // 中立軸
      column = new Array();
      column.push('x (mm)');
      for ( let c = 1; c < column_count; c++) {
        column.push('134.2');
      }
      rows.push(column);

      // 終局耐力
      column = new Array();
      column.push('Mu (kN・m)');
      for ( let c = 1; c < column_count; c++) {
        column.push('7835.0');
      }
      rows.push(column);

      // 部材係数
      column = new Array();
      column.push('γb');
      for ( let c = 1; c < column_count; c++) {
        column.push('1.1');
      }
      rows.push(column);

      // 設計終局耐力
      column = new Array();
      column.push('Mud (kN・m)');
      for ( let c = 1; c < column_count; c++) {
        column.push('7122.7');
      }
      rows.push(column);

      // 安全係数
      column = new Array();
      column.push('γi');
      for ( let c = 1; c < column_count; c++) {
        column.push('1.2');
      }
      rows.push(column);

      // 安全率
      column = new Array();
      column.push('γi・Md/Mud');
      for ( let c = 1; c < column_count; c++) {
        column.push('0.52');
      }
      rows.push(column);

      // 判定
      column = new Array();
      column.push('照査結果');
      for ( let c = 1; c < column_count; c++) {
        column.push('OK');
      }
      rows.push(column);

      // 追加
      pages['tables'].push(rows);
    }


    result.push(pages);
    result.push(pages);
    return result;
  }

}
