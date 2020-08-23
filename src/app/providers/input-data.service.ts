import { Injectable } from '@angular/core';
import { ɵangular_packages_platform_browser_platform_browser_k } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class InputDataService {

  public DEFAULT_MEMBER_COUNT: number = 25;
  // ピックアップファイル
  public pickup_filename: string;
  public pickup_data: Object;

  public isManual(): boolean {
    if ( this.pickup_filename.trim().length === 0 ){
      return true;
    } else {
      return false;
    }
  }

  constructor() { 
    this.pickup_filename = '';
    this.pickup_data = {};
  }

  public is3DPickUp(): boolean {
    switch (this.getExt(this.pickup_filename)){
      case 'csv':
        return true;
        break;
      default:
        return false;
    }
  }

  
  // ファイル名から拡張子を取得する関数
  public getExt(filename: string): string {
    const pos = filename.lastIndexOf('.');
    if (pos === -1) {
      return '';
    }
    return filename.slice(pos + 1);
  }

  public rebar_List: any[] = [
      { 'D': 10, 'As': 71.33 },
      { 'D': 13, 'As': 126.7 },
      { 'D': 16, 'As': 198.6 },
      { 'D': 19, 'As': 286.5 },
      { 'D': 22, 'As': 387.1 },
      { 'D': 25, 'As': 506.7 },
      { 'D': 29, 'As': 642.4 },
      { 'D': 32, 'As': 794.2 },
      { 'D': 35, 'As': 956.6 },
      { 'D': 38, 'As': 1140 },
      { 'D': 41, 'As': 1340 },
      { 'D': 51, 'As': 2027 }
    ];

  public getRebar(Dia: number): any {
    const result = this.rebar_List.find( (value) => {
      return value.D === Dia;
    });
    return result;
  }

  public getNextRebar(Dia: any): any {
    let result = undefined;
    const d: number = this.toNumber(Dia);
    if (d === null) { return undefined };
    for (let i = 0; i < this.rebar_List.length - 1; i++){
      if (d === this.rebar_List[i].D) {
        result = this.rebar_List[i + 1];
        break;
      }
    }
    return result;
  }

  public getPreviousRebar(Dia: any): any {
    let result = undefined;
    const d: number = this.toNumber(Dia);
    if (d === null) { return undefined };
    for (let i = 1; i < this.rebar_List.length; i++) {
      if (d === this.rebar_List[i].D) {
        result = this.rebar_List[i - 1];
        break;
      }
    }
    return result;
  }

  // グループ番号の入力から番号のみ取り出す
  public getGroupeNo(value: any): number {
    // null だったら
    if (value === null) {
      return null;
    }
    // string に変換
    const str: string = value.toString().trim();
    if (str.length === 0) {
      return null;
    }
    // 正規表現を使って数字だけ取り出す
    const res: string = str.replace(/[^0-9]/g, '');
    // 数値型　に変換
    let result: number = this.toNumber(res);

    return result;
  }
  /// <summary>
  /// 文字列string を数値にする
  /// </summary>
  /// <param name="num">数値に変換する文字列</param>
  public toNumber(num: any): number {
    let result: number = null;
    try {
      const tmp: string = num.toString().trim();
      if (tmp.length > 0) {
        result = ((n: number) => isNaN(n) ? null : n)(+tmp);
      }
    } catch {
      result = null;
    }
    return result;
  }

}
