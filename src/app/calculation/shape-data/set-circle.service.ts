import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SetBarService } from './set-bar.service';

@Injectable({
  providedIn: 'root'
})
export class SetCircleService {

  constructor(
    private bars: InputBarsService,
    private fsk: SetBarService,
    private helper: DataHelperModule
  ) { }


  // 断面の幅と高さ（フランジ幅と高さ）を取得する
  public getShape(shapeName: string, member: any, target: string = 'Md'): any {

    const result = {};

    let h: number, b: number, Area: number;

    switch (shapeName) {
      case 'Circle':            // 円形
        h = this.helper.toNumber(member.H);
        if (h === null) {
          h = this.helper.toNumber(member.B);
        }
        if (target === 'Vd') {
          // せん断照査用の換算矩形断面を算定
          Area = Math.pow(h, 2) * Math.PI / 4;
          h = Math.sqrt(Area);
        }
        result['H'] = h;
        break;

      case 'Ring':              // 円環
        h = this.helper.toNumber(member.H); // 外径
        b = this.helper.toNumber(member.B); // 内径
        if (target === 'Md') {
          result['H'] = h;
          result['B'] = b;
        } else if (target === 'Vd') {
          // せん断照査用の換算矩形断面を算定
          Area = Math.pow(h, 2) * Math.PI / 4;
          result['H'] = Math.sqrt(Area);
          Area -= (b ** 2) * Math.PI / 4;
          result['B'] = h - Math.sqrt((h ** 2) - Area);
        }
        break;
    }

    return result;
  }
  

  // 円形断面の POST 用 データ作成
  public getCircle(member: any): any {

    const result1 = this.getCircleSection(member);
    const result2 = this.getCircleBar(member);

    return result;
  }

  // 円環断面の POST 用 データ作成
  public getRing(member: any): any {

    const result1 = this.getRingSection(member);
    const result2 = this.getCircleBar(member);

    return result;
  }


  // 円形の 鉄筋のPOST用 データを登録する。
  private getCircleBar(member: any, index: number, side: string, safety: any ): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    // 鉄筋配置
    let h: number = this.helper.toNumber(member.H);
    if (h === null) {
      h = this.helper.toNumber(member.B);
    }
    if (h === null) {
      return result;
    }

    const barInfo = this.getInputData("Circle", index, side, h);
    const tension: any = barInfo.tension;

    const fsy = this.fsk.getFsyk(
      barInfo.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    const id = "s" + fsy.id;

    // 鉄筋径
    let dia: string = tension.mark + tension.rebar_dia;
    if (fsy.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + tension.rebar_dia;
    }

    for (let i = 0; i < tension.n; i++) {
      const Depth = tension.dsc + i * tension.space;
      const Rt: number = h - Depth * 2; // 鉄筋直径
      const num = tension.rebar_n - tension.line * i; // 鉄筋本数
      const steps: number = 360 / num; // 鉄筋角度間隔

      for (let j = 0; j < num; j++) {
        const deg = j * steps;
        const dst = Rt / 2 - (Math.cos(this.Radians(deg)) * Rt) / 2 + Depth;
        const tensionBar: boolean = deg >= 135 && deg <= 225 ? true : false;
        const Steel1 = {
          Depth: dst, // 深さ位置
          i: dia, // 鋼材
          n: 1, // 鋼材の本数
          IsTensionBar: tensionBar, // 鋼材の引張降伏着目Flag
          ElasticID: id, // 材料番号
        };
        result.Steels.push(Steel1);
      }
    }

    // 基準となる 鉄筋強度
    const rs = safety.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsy.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    return result;
  }

  // 鉄筋の情報を返す
  private getInputData(shapeName: string, index: number, side: string, b: number, h: number = null): any {
    let result = {};

    const bar = this.bars.getCalcData(index);

    let tension: any, compres: any = null, sidebar: any = null;

    tension = this.rebarInfo(bar.rebar1);
    if(tension === null){
      throw("引張鉄筋情報がありません");
    }
    if(tension.rebar_ss === null){
      const D = h - tension.dsc * 2;
      tension.rebar_ss = D / tension.line;
    }

    result = {
      tension,
      compres,
      sidebar,
      stirrup: bar.stirrup,
      tan: bar.tan
    };
    return result;
  }

  // 圧縮・引張主鉄筋の情報を返す
  private rebarInfo(barInfo: any): any {
    // 鉄筋径
    if (this.helper.toNumber(barInfo.rebar_dia) === null) {
      return null;
    }
    const dia = Math.abs(barInfo.rebar_dia);

    // 異形鉄筋:D, 丸鋼: R
    const mark = barInfo.rebar_dia > 0 ? "D" : "R";

    // 鉄筋全本数
    let rebar_n = this.helper.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      rebar_n = 0;
    }

    // 1段当りの本数
    let line = this.helper.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const n = Math.ceil(rebar_n / line);

    // 鉄筋アキ
    let space = this.helper.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.helper.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }

    let cos = this.helper.toNumber(barInfo.cos);
    if (cos === null) {
      cos = 1;
    }

    let ss = this.helper.toNumber(barInfo.rebar_ss);
    if (ss === null) {
      ss = 0;
    }

    return {
      rebar_dia: dia, // 鉄筋径
      mark,           // 異形鉄筋:D, 丸鋼：R
      rebar_n,        // 全本数
      n,              // 段数
      dsc,            // 最外縁の鉄筋かぶり
      line,           // 1列当たりの鉄筋本数
      space,          // 1段目と2段目のアキ
      rebar_ss: ss,   // 鉄筋間隔
      cos             // 角度補正係数 cosθ
    }
  }

  // 円形断面の POST 用 データ作成
  private getCircleSection(member: any): any {

    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('Circle', member);
    let h: number = shape.H;
    const x1: number = h / RCOUNT;
    let b1 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2: number = x1 * i;
      const b2: number = this.getCircleWidth(h, x2);
      const section = {
        Height: x1,     // 断面高さ
        WTop: b1,       // 断面幅（上辺）
        WBottom: b2,    // 断面幅（底辺）
        ElasticID: 'c'  // 材料番号
      };
      result.Sections.push(section);
      b1 = b2;
    }
    result['member'] = shape;
    return result;
  }

  // 円環断面の POST 用 データ作成
  public getRingSection(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('Ring', member)
    let h: number = shape.H;
    let b: number = shape.B;
    const x1: number = h / RCOUNT;
    const x3: number = (h - b) / 2;

    let b1 = 0;
    let b3 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2 = x1 * i;
      const x4 = x2 - x3;
      const b2 = this.getCircleWidth(h, x2);
      let b4: number;
      if (x2 < x3) {
        b4 = 0;
      } else if (x2 > x3 + b) {
        b4 = 0;
      } else {
        b4 = this.getCircleWidth(b, x4);
      }

      const section = {
        Height: x1,       // 断面高さ
        WTop: b1 - b3,    // 断面幅（上辺）
        WBottom: b2 - b4, // 断面幅（底辺）
        ElasticID: 'c'    // 材料番号
      };
      result.Sections.push(section);
      b1 = b2;
      b3 = b4;
    }

    result['member'] = shape;
    return result;
  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2));

    return Math.abs(2 * c);

  }

  // 角度をラジアンに変換
  public Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

}
