import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SectionInfoService } from './section-info.service';

@Injectable({
  providedIn: 'root'
})
export class SetVerticalOvalService {

  constructor(
    private bars: InputBarsService,
    private info: SectionInfoService,
    private helper: DataHelperModule
  ) { }


  public getVerticalOval(member: any, index: number, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const result1 = this.getVerticalOvalSection(member, safety);
    for(const key of result1){
      result[key] = result1[key];
    }

    const result2 = this.getVerticalOvalBar(member, index, safety);
    for(const key of result2){
      result[key] = result2[key];
    }

    return result;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOvalSection(member: any, safety: any): any {
    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const RCOUNT = 100;

    // 断面情報を集計
    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const steps = 180 / RCOUNT;

    let olddeg = 0;
    // 上側の曲線部
    for (let deg = steps; deg <= 90; deg += steps) {
      const section1 = {
        Height: (Math.cos(this.helper.Radians(olddeg)) - Math.cos(this.helper.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.helper.Radians(olddeg)) * b,   // 断面幅（上辺）
        WBottom: Math.sin(this.helper.Radians(deg)) * b,   // 断面幅（底辺
        ElasticID: 'c'                        // 材料番号
      };
      result.Sections.push(section1);
      olddeg = deg;
    }

    // 直線部
    const section2 = {
      Height: h - b,    // 断面高さ
      WTop: b,          // 断面幅（上辺）
      WBottom: b,       // 断面幅（底辺
      ElasticID: 'c'    // 材料番号
    };
    result.Sections.push(section2);

    // 下側の曲線部
    for (let deg = 90 + steps; deg <= 180; deg += steps) {
      const section3 = {
        Height: (Math.cos(this.helper.Radians(olddeg)) - Math.cos(this.helper.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.helper.Radians(olddeg)) * b, // 断面幅（上辺）
        WBottom: Math.sin(this.helper.Radians(deg)) * b, // 断面幅（底辺
        ElasticID: 'c'                            // 材料番号
      };
      result.Sections.push(section3);
      olddeg = deg;
    }

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    return result;
  }

  private getVerticalOvalBar(member: any, index: number, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {},
    };

    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const bar = this.bars.getCalcData(index);
    const tension: any = this.helper.rebarInfo(bar.rebar1);
    const compres: any =  this.helper.rebarInfo(bar.rebar2);
    if(tension === null){
      throw("引張鉄筋情報がありません");
    }
    if(tension.rebar_ss === null){
      const D = h - tension.dsc * 2;
      tension.rebar_ss = D / tension.line;
    }
    const sideBar = this.helper.sideInfo(bar.sidebar, tension.dsc, compres.dsc, h);

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    // 鉄筋強度
    const fsy1 = this.helper.getFsyk(
      tension.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    const id1 = "s" + fsy1.id;
    result.SteelElastic.push({
      fsk: fsy1.fsy / rs,
      Es: 200,
      ElasticID: id1,
    });

    // 鉄筋径
    let dia1: string = tension.mark + tension.rebar_dia;
    if (fsy1 === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia1 = "R" + tension.rebar_dia;
    }

    // 圧縮（上側）鉄筋配置
    const compresBarList: any[] = new Array();
    if (safety.safety_factor.range >= 2) {
      const fsy2 = this.helper.getFsyk(
        compres.rebar_dia,
        safety.material_bar,
        "tensionBar"
      );

      let dia2: string = compres.mark + compres.rebar_dia;
      if (fsy2 === 235) {
        // 鉄筋強度が 235 なら 丸鋼
        dia2 = "R" + compres.rebar_dia;
      }

      const id2 = "s" + fsy2.id;
      if (result.SteelElastic.find((e) => e.ElasticID === id2) === undefined) {
        result.SteelElastic.push({
          fsk: fsy2.fsy / rs,
          Es: 200,
          ElasticID: id2,
        });
      }

      for (let i = 0; i < compres.n; i++) {
        const Depth = compres.dsc + i * compres.space;
        const Rt: number = b - Depth * 2; // 鉄筋直径
        const steps: number = 180 / (compres.rebar_n - compres.line * i + 1); // 鉄筋角度間隔

        for (let deg = steps; deg < 180; deg += steps) {
          const dsc = b / 2 - Math.sin(this.helper.Radians(deg)) * Rt;
          const Steel1 = {
            Depth: dsc, // 深さ位置
            i: dia2, // 鋼材
            n: 1, // 鋼材の本数
            IsTensionBar: false, // 鋼材の引張降伏着目Flag
            ElasticID: id2, // 材料番号
          };
          compresBarList.push(Steel1);
        }
      }

    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    if (safety.safety_factor.range >= 3) {
      const rebar = this.getSideBar(sideBar, safety); //, h - b, 0, 0);
      sideBarList = rebar.Steels;
      for (const elastic of rebar.SteelElastic) {
        result.SteelElastic.push(elastic);
      }

    }

    // 引張（下側）鉄筋配置
    const tensionBarList: any[] = new Array();

    for (let i = 0; i < tension.n; i++) {
      const Depth = tension.dsc + i * tension.space;
      const Rt: number = b - Depth * 2; // 鉄筋直径
      // 鉄筋角度間隔
      const steps: number = 180 / (tension.rebar_n - tension.line * i + 1);

      for (let deg = steps; deg < 180; deg += steps) {
        const dst = h - b / 2 + Math.sin(this.helper.Radians(deg)) * Rt;
        const Steel1 = {
          Depth: dst, // 深さ位置
          i: dia1, // 鋼材
          n: 1, // 鋼材の本数
          IsTensionBar: true, // 鋼材の引張降伏着目Flag
          ElasticID: id1, // 材料番号
        };
        tensionBarList.push(Steel1);
      }
    }

    // 圧縮鉄筋の登録
    for (const Asc of compresBarList) {
      Asc.n = Asc.n;
      result.Steels.push(Asc);
    }

    // 側面鉄筋の登録
    for (const Ase of sideBarList) {
      Ase.Depth = Ase.Depth + b / 2;
      Ase.n = Ase.n;
      result.Steels.push(Ase);
    }

    // 引張鉄筋の登録
    for (const Ast of tensionBarList) {
      result.Steels.push(Ast);
    }

    return result;
  }

  // 矩形、Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar( barInfo: any, safety: any ): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    if (barInfo === null) {
      return result; // 側方鉄筋の入力が無い場合
    }

    // 鉄筋強度
    const fsy1 = this.helper.getFsyk(
      barInfo.side_dia,
      safety.material_bar,
      "sidebar"
    );
    const id = "s" + fsy1.id;

    // 鉄筋径
    let dia: string = barInfo.mark + barInfo.side_dia;
    if (fsy1.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + barInfo.side_dia;
    }

    // 鉄筋情報を登録
    for (let i = 0; i < barInfo.n; i++) {
      const Steel1 = {
        Depth: barInfo.dse + i * barInfo.space,
        i: dia,
        n: barInfo.line,
        IsTensionBar: false,
        ElasticID: id,
      };
      result.Steels.push(Steel1);
    }

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    result.SteelElastic.push({
      fsk: fsy1.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    return result;
  }

}
