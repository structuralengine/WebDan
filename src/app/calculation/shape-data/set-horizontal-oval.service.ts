import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SectionInfoService } from './section-info.service';

@Injectable({
  providedIn: 'root'
})
export class SetHorizontalOvalService {

  constructor(
    private bars: InputBarsService,
    private info: SectionInfoService,
    private helper: DataHelperModule
  ) { }

  public getHorizontalOval(member: any, index: number, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const result1 = this.getHorizontalOvalSection(member, safety);
    for(const key of result1){
      result[key] = result1[key];
    }

    const result2 = this.getHorizontalOvalBar(member, index, safety);
    for(const key of result2){
      result[key] = result2[key];
    }

    return result;
  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOvalSection(member: any, safety: any): any {
    
    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const RCOUNT = 100;

    // 断面情報を集計
    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const steps = 180 / RCOUNT;

    let olddeg = 0;
    for (let deg = steps; deg <= 180; deg += steps) {
      const section = {
        Height: (Math.cos(this.helper.Radians(olddeg)) - Math.cos(this.helper.Radians(deg))) * h / 2, // 断面高さ
        WTop: b - h + Math.sin(this.helper.Radians(olddeg)) * h, // 断面幅（上辺）
        WBottom: b - h + Math.sin(this.helper.Radians(deg)) * h, // 断面幅（底辺
        ElasticID: 'c'                                    // 材料番号
      };
      result.Sections.push(section);
      olddeg = deg;
    }

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    return result;
  }

  private getHorizontalOvalBar(member: any, index: number, safety: any ): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    const h: number = member.H; // ハンチを含む高さ
    const b: number = member.B;

    const bar = this.bars.getCalcData(index);
    const tension = this.info.rebarInfo(bar.rebar1);
    const compres = this.info.rebarInfo(bar.rebar2);
    if(tension === null){
      throw("引張鉄筋情報がありません");
    }
    if(tension.rebar_ss === null){
      tension.rebar_ss = (b - h) / tension.line;
    }
    const sideInfo = this.info.sideInfo(bar.sidebar, tension.dsc, compres.dsc, h);


    const tensionBar = this.getCompresBar(tension, safety);
    const tensionBarList = tensionBar.Steels;
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }

    // 鉄筋強度の入力
    for (const elastic of tensionBar.SteelElastic) {
      if (
        result.SteelElastic.find((e) => e.ElasticID === elastic.ElasticID) ===
        undefined
      ) {
        result.SteelElastic.push(elastic);
      }
    }

    // 圧縮鉄筋 をセットする
    let compresBarList: any[] = new Array();
    if (safety.safety_factor.range >= 2) {
      const compresBar = this.getCompresBar(compres, safety);
      compresBarList = compresBar.Steels;

      // 鉄筋強度の入力
      for (const elastic of compresBar.SteelElastic) {
        if (
          result.SteelElastic.find((e) => e.ElasticID === elastic.ElasticID) ===
          undefined
        ) {
          result.SteelElastic.push(elastic);
        }
      }

    }

    // 側方鉄筋 をセットする
    let sideBar: any;
    let sideBarList = new Array();
    if (safety.safety_factor.range >= 3) {
      sideBar = this.getSideBar(
        sideInfo,
        safety,
        tension,
        compres,
        h
      );
      sideBarList = sideBar.Steels;
      // 鉄筋強度の入力
      for (const elastic of sideBar.SteelElastic) {
        result.SteelElastic.push(elastic);
      }
    }

    // 圧縮鉄筋の登録
    let cosAsc: number = compres.cos;

    for (const Asc of compresBarList) {
      Asc.n = Asc.n * cosAsc;
      Asc.Depth = Asc.Depth / cosAsc;
      result.Steels.push(Asc);
    }

    // 側面鉄筋の登録
    for (const Ase of sideBarList) {
      Ase.n = Ase.n;
      result.Steels.push(Ase);
    }

    // 引張鉄筋の登録
    let cosAst: number = tension.cos;

    for (const Ast of tensionBarList) {
      Ast.n = Ast.n * cosAst;
      Ast.Depth = h - Ast.Depth / cosAst;
      Ast.IsTensionBar = true;
      result.Steels.push(Ast);
    }

    return result;
  }

  // 矩形、Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    const fsy = this.info.getFsyk(
      barInfo.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    const id = "t" + fsy.id;

    result.SteelElastic.push({
      fsk: fsy.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    // 鉄筋径
    let dia: string = barInfo.mark + barInfo.rebar_dia;
    if (fsy.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + barInfo.rebar_dia;
    }

    // 鉄筋情報を登録
    let rebar_n = barInfo.rebar_n;
    const dsc = barInfo.dsc / barInfo.cos;
    const space = barInfo.space / barInfo.cos;
    for (let i = 0; i < barInfo.n; i++) {
      const dst: number = dsc + i * space;
      const Steel1 = {
        Depth: dst,
        i: dia,
        n: Math.min(barInfo.line, rebar_n * barInfo.cos),
        IsTensionBar: false,
        ElasticID: id,
      };
      result.Steels.push(Steel1);
      rebar_n = rebar_n - barInfo.line;
    }

    return result;
  }

  private getSideBar(
    barInfo: any, safety: any, tensionBar: any, compresBar: any, height: number ): any[] {
    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (barInfo.side_dia === null) {
      return new Array();
    }
    // 鉄筋段数
    const n = barInfo.sidebar_n;
    if (n === 0) {
      return new Array(); // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 主鉄筋のかぶり
    let dst = tensionBar.rebar_cover;
    let dsc = compresBar.rebar_cover;

    // 鉄筋配置直径
    const Rt: number = height - (dst + dsc);

    // 鉄筋配置弧の長さ
    const arcLength: number = (Rt * Math.PI) / 2;

    // 側方鉄筋スタート位置
    let dse = barInfo.side_cover;
    if (this.helper.toNumber(dse) === null) {
      dse = arcLength / (n + 1);
    }

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.helper.toNumber(space) === null) {
      space = arcLength / (n + 1);
    }

    // 弧の長さより長くなってしまった場合は調整する
    if (dse + space * n > arcLength) {
      space = (arcLength - dse * 2) / (n - 1);
    }

    // 1段当りの本数
    const line = 2;

    const fsy = this.info.getFsyk(barInfo.rebar_dia, safety.material_bar, "sidebar");
    const id = "s" + fsy.id;

    // 鉄筋径
    let dia: string = barInfo.mark + barInfo.side_dia;
    if (fsy.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + barInfo.side_dia;
    }

    // 鉄筋情報を登録
    const start_deg: number = (360 * dse) / (Math.PI * Rt); // 鉄筋配置開始角度
    const steps_deg: number = (360 * space) / (Math.PI * Rt); // 鉄筋配置角度
    const end_deg: number = start_deg + steps_deg * (n - 1); // 鉄筋配置終了角度
    for (let deg = start_deg; deg <= end_deg; deg += steps_deg) {
      const dt = Rt / 2 - (Math.cos(this.helper.Radians(deg)) * Rt) / 2 + dsc;

      const Steel1 = {
        Depth: dt,
        i: dia,
        n: line,
        IsTensionBar: false,
        ElasticID: id,
      };
      result.push(Steel1);

    }

    return result;
  }

}
