import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetVerticalOvalService {

  constructor(
    private bars: InputBarsService,
    private helper: DataHelperModule
  ) { }


  public getVerticalOval(member: any, index: number,side: string, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const RCOUNT = 100;

    // 断面情報を集計
    const section = this.getShape(member, index, side, safety);
    const h: number = section.H;
    const b: number = section.B;

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

    // 鉄筋
    const result2 = this.getVerticalOvalBar(section, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    return result;
  }

  // 断面の幅と高さを取得する
  public getShape(member: any, index: number, side: string, safety: any): any {

    const result = this.getSection(member);

    const bar: any = this.bars.getCalcData(index);

    let tension: any;
    let compress: any;
    switch (side) {
      case "上側引張":
        tension = this.helper.rebarInfo(bar.rebar1);
        compress = this.helper.rebarInfo(bar.rebar2);
        break;
      case "下側引張":
        tension = this.helper.rebarInfo(bar.rebar2);
        compress = this.helper.rebarInfo(bar.rebar1);
        break;
    }
    if(tension === null){
      throw("引張鉄筋情報がありません");
    }
    if(tension.rebar_ss === null){
      const D = result.H - tension.dsc * 2;
      tension.rebar_ss = D / tension.line;
    }

    // tension
    const fsyt = this.helper.getFsyk(
      tension.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    if (fsyt.fsy === 235)  tension.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
    tension['fsy'] = fsyt;
    
    // 登録
    result['tension'] = tension;

    // compres
    if (safety.safety_factor.range >= 2) {
      const fsyc = this.helper.getFsyk(
        compress.rebar_dia,
        safety.material_bar,
        "tensionBar"
      );
      if (fsyc.fsy === 235) compress.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
      compress['fsy'] = fsyc;
      result['compress'] = compress;
    }

    // sidebar
    if (safety.safety_factor.range >= 3) {
      const sidebar: any = this.helper.sideInfo(bar.sidebar, tension.dsc, compress.dsc, result.H);
      const fsye = this.helper.getFsyk(
        sidebar.rebar_dia,
        safety.material_bar,
        "sidebar"
      );
      if (fsye.fsy === 235) sidebar.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
      sidebar['fsy'] = fsye;
      result['sidebar'] = sidebar;
    }
    
    result['stirrup'] = bar.stirrup;
    result['bend'] = bar.bend;

    return result;

  }
  
  public getSection(member){
    
    const result = {
      H: null,
      B: null
    };

    let h: number = this.helper.toNumber(member.H);
    result.H = h;

    const b = this.helper.toNumber(member.B);
    result.B = b;

    if (h === null || b === null) {
      throw('形状の入力が正しくありません');
    }

    return result
  }

  private getVerticalOvalBar(section: any, safety: any): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };

    const h: number = section.H;
    const b: number = section.B;
    const tension: any = section.tension;

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    // 鉄筋強度
    const fsy1 = tension.fsy;
    const id1 = "s" + fsy1.id;
    result.SteelElastic.push({
      fsk: fsy1.fsy / rs,
      Es: 200,
      ElasticID: id1,
    });

    // 鉄筋径
    const dia1: string = tension.mark + tension.rebar_dia;

    // 圧縮（上側）鉄筋配置
    const compresBarList: any[] = new Array();
    if ('compress' in section) {
      const compress: any = section.compress;
      const fsy2 = compress.fsy;
      const dia2: string = compress.mark + compress.rebar_dia;

      const id2 = "s" + fsy2.id;
      if (result.SteelElastic.find((e) => e.ElasticID === id2) === undefined) {
        result.SteelElastic.push({
          fsk: fsy2.fsy / rs,
          Es: 200,
          ElasticID: id2,
        });
      }

      for (let i = 0; i < compress.n; i++) {
        const Depth = compress.dsc + i * compress.space;
        const Rt: number = b - Depth * 2; // 鉄筋直径
        const steps: number = 180 / (compress.rebar_n - compress.line * i + 1); // 鉄筋角度間隔

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
    if ('sidebar' in section) {
      const sideBar: any = section.sidebar;
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
    const fsy1 = barInfo.fsy;
    const id = "s" + fsy1.id;

    // 鉄筋径
    let dia: string = barInfo.mark + barInfo.side_dia;

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
