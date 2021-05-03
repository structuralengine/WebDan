import { NgModule } from "@angular/core";

@NgModule({
  imports: [],
  exports: [],
})
export class DataHelperModule {

  constructor() {}

  

  // ファイル名から拡張子を取得する関数
  public getExt(filename: string): string {
    const pos = filename.lastIndexOf('.');
    if (pos === -1) {
      return '';
    }
    const ext = filename.slice(pos + 1);
    return ext.toLowerCase();
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

  // 鉄筋の断面積
  public getAs(strAs: string): number {
    let result: number = 0;
    if (strAs.indexOf("φ") >= 0) {
      const fai: number = this.toNumber(strAs.replace("φ", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("R") >= 0) {
      const fai: number = this.toNumber(strAs.replace("R", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("D") >= 0) {
      const fai: number = this.toNumber(strAs.replace("D", ""));
      if (fai === null) {
        return 0;
      }
      let reverInfo = this.rebar_List.find((value) => {
        return value.D === fai;
      });
      if (reverInfo === undefined) {
        return 0;
      }
      result = reverInfo.As;
    } else {
      result = this.toNumber(strAs);
      if (result === null) {
        return 0;
      }
    }
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