import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetRectService {

  constructor(
    private bars: InputBarsService,
    private helper: DataHelperModule
  ) { }

  // 矩形断面の POST 用 データ作成
  public getRectangle(target: string, member: any, index: number, side: string, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    // 断面情報を集計
    const shape = this.getRectangleShape(member, target, index, side, safety)
    const h: number = shape.H;
    const b: number = shape.B;

    const section = {
      Height: h, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    result.Sections.push(section);
    result['member'] = shape;

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    // 鉄筋情報を集計  
    const result2 = this.getRectBar(shape, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    // 配筋が上下対象でなければ、symmetry = false
    const Steels = result['Steels'];
    let j = Steels.length-1;
    grid_loop:
    for(let i=0; i<Steels.length; i++){
      const b1 = Steels[i];
      const b2 = Steels[j];
      const d1 = b1.Depth
      const d2 = section.Height - b2.Depth;
      if(d1 !== d2){
        result.symmetry = false;
        break;
      }
      for(const key of ['i', 'n', 'ElasticID']){
        if(d1[key] !== d2[key]){
          result.symmetry = false;
          break grid_loop;
        }
      }
      j--;
    }
    if(result.symmetry === true){
      console.log()
    }
    return result;
  }

  public getTsection(target: string, member: any, index: number, side: string, safety: any): object {
    const result = { symmetry: false, Sections: [], SectionElastic:[] };

    // 断面情報を集計
    const shape = this.getTsectionShape(member, target, index, side, safety);
    const h: number = shape.H;
    const b: number = shape.B;
    const bf: number = shape.Bt;
    const hf: number = shape.t;

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    result.Sections.push(section1);

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    result.Sections.push(section2);

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    // 鉄筋情報を集計  
    const result2 = this.getRectBar(shape, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    return result;
  }

  public getInvertedTsection(target: string, member: any, index: number, side: string, safety: any): object {
    
    const result = { symmetry: false, Sections: [], SectionElastic:[] };

    // 断面情報を集計
    const shape = this.getTsectionShape(member, target, index, side, safety);
    const h: number = shape.H;
    const b: number = shape.B;
    const bf: number = shape.Bt;
    const hf: number = shape.t;

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    result.Sections.push(section2);

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    result.Sections.push(section1);

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    // 鉄筋情報を集計  
    const result2 = this.getRectBar(shape, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    return result;
  }
  
  public getSection(member: any, target: string, index: number){
    
    const result = {
      H: null,
      B: null,
      Bt: null,
      t: null,
    };

    const bar: any = this.bars.getCalcData(index);
    const haunch: number = (target === 'Md') ? bar.haunch_M : bar.haunch_V;

    let h: number = this.helper.toNumber(member.H);
    if (this.helper.toNumber(haunch) !== null) {
      h += haunch * 1;
    }
    result.H = h;

    const b = this.helper.toNumber(member.B);
    result.B = b;

    if (h === null || b === null) {
      throw('形状の入力が正しくありません');
    }

    return result
  }

  // 断面の幅と高さ（フランジ幅と高さ）を取得する
  public getRectangleShape(member: any, target: string, index: number, side: string, safety: any): any {

    const result = this.getSection(member, target, index);

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
      tension.rebar_ss = result.B / tension.line;
    }

    // tension
    const fsyt = this.helper.getFsyk(
      tension.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    if (fsyt.fsy === 235)  tension.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
    tension['fsy'] = fsyt;
    tension['rs'] = safety.safety_factor.rs;;
    

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
      compress['rs'] = safety.safety_factor.rs;;
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
      sidebar['rs'] = safety.safety_factor.rs;
      result['sidebar'] = sidebar;
    }
    
    result['stirrup'] = bar.stirrup;
    result['bend'] = bar.bend;

    return result;
  }
 
  public getTsectionShape(member: any, target: string, index: number, side: string, safety: any): any {

    const result = this.getRectangleShape(member, target, index, side, safety);
    
    let bf = this.helper.toNumber(member.Bt);
    let hf = this.helper.toNumber(member.t);
    if (bf === null) { bf = result.B; }
    if (hf === null) { hf = result.H; }
    result['Bt'] = bf;
    result['t'] = hf;

    return result;
  }

  // 矩形、Ｔ形断面の 鉄筋のPOST用 データを登録する。
  private getRectBar( section: any, safety: any ): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    const h: number = section.H; // ハンチを含む高さ
    const tension: any = section.tension;

    const tensionBar = this.getCompresBar(tension, safety);
    const tensionBarList = tensionBar.Steels;
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }

    // 鉄筋強度の入力
    for (const elastic of tensionBar.SteelElastic) {
      if ( result.SteelElastic.find(
          (e) => e.ElasticID === elastic.ElasticID) === undefined ) {
        result.SteelElastic.push(elastic);
      }
    }

    // 圧縮鉄筋 をセットする
    let compresBarList: any[] = new Array();
    let cosAsc: number = 1;
    if ('compress' in section) {
      const compress: any = section.compress;
      const compresBar = this.getCompresBar(compress, safety);
      compresBarList = compresBar.Steels;

      // 鉄筋強度の入力
      for (const elastic of compresBar.SteelElastic) {
        if ( result.SteelElastic.find(
          (e) => e.ElasticID === elastic.ElasticID) === undefined ) {
          result.SteelElastic.push(elastic);
        }
      }
      cosAsc = compress.cos;
    }

    // 側方鉄筋 をセットする
    let sideBarList = new Array();
    if ('sidebar' in section) {
      const sideInfo: any = section.sidebar;
      const sideBar = this.getSideBar(
        sideInfo,
        safety
      );
      sideBarList = sideBar.Steels;
      // 鉄筋強度の入力
      for (const elastic of sideBar.SteelElastic) {
        result.SteelElastic.push(elastic);
      }
    }

    // 圧縮鉄筋の登録
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
    const rs = barInfo.rs;

    const fsy = barInfo.fsy;
    const id = "t" + fsy.id;

    result.SteelElastic.push({
      fsk: fsy.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    // 鉄筋径
    const dia: string = barInfo.mark + barInfo.rebar_dia;

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

  // 矩形、Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar( barInfo: any, safety: any): any {

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
    const rs = barInfo.rs;

    result.SteelElastic.push({
      fsk: fsy1.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    return result;
  }

}
