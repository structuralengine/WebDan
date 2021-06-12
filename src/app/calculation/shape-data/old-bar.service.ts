import { Injectable } from "@angular/core";
import { InputBarsService } from "../../components/bars/bars.service";
import { DataHelperModule } from "../../providers/data-helper.module";
import { SetSectionService } from "./old-section.service";

@Injectable({
  providedIn: "root",
})
export class SetBarService {
  constructor(
    private bars: InputBarsService,
    private section: SetSectionService,
    private helper: DataHelperModule
  ) { }

  // 鉄筋情報を集計する
  public getPostData(member: any, index: number, side: string, shape: string, safety: any): any {

    // 鉄筋情報を 集計
    let result: object;

    switch (shape) {
      case "Circle":
      case "Ring":
        result = this.getCircleBar(member, index, side, safety);
        break;
      case "Rectangle":
      case "Tsection":
      case "InvertedTsection":
        result = this.getRectBar(member, index, side, safety);
        break;
      case "HorizontalOval":
        result = this.getRectBar(member, index, "小判", safety);
        break;
      case "VerticalOval":
        result = this.getVerticalOvalBar(member, index, safety);
        break;
      default:
        console.log("断面形状：" + shape + " は適切ではありません。");
        return null;
    }

    return result;
  }

  // 横小判形における 側面鉄筋 の 鉄筋情報を生成する関数
  private getHorizontalOvalSideBar(
    barInfo: any,
    safety: any,
    tensionBar: any,
    compresBar: any,
    height: number
  ): any[] {
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

    const fsy = this.getFsyk(barInfo.rebar_dia, safety.material_bar, "sidebar");
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
      const dt = Rt / 2 - (Math.cos(this.Radians(deg)) * Rt) / 2 + dsc;

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

  // 縦小判形の 鉄筋のPOST用 データを登録する。
  private getVerticalOvalBar(member: any, index: number, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {},
    };

    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const barInfo = this.getInputData("VerticalOval", index, "小判", b, h);
    const tension: any = barInfo.tension;
    const compres: any = barInfo.compres;
    const sideBar = barInfo.sidebar;

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    // 鉄筋強度
    const fsy1 = this.getFsyk(
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
      const fsy2 = this.getFsyk(
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
          const dsc = b / 2 - Math.sin(this.Radians(deg)) * Rt;
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
        const dst = h - b / 2 + Math.sin(this.Radians(deg)) * Rt;
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

  // 円形の 鉄筋のPOST用 データを登録する。
  private getCircleBar(
    member: any,
    index: number,
    side: string,
    safety: any
  ): any {

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

    const fsy = this.getFsyk(
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

  // 矩形、Ｔ形断面の 鉄筋のPOST用 データを登録する。
  private getRectBar(
    member: any,
    index: number,
    side: string,
    safety: any
  ): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    const h: number = member.H; // ハンチを含む高さ
    const b: number = member.B;
    const barInfo = this.getInputData("Rectangle", index, side, b, h);

    let tension: any = barInfo.tension;
    let compres: any = barInfo.compres;

    const tensionBar = this.getCompresBar(barInfo.tension, safety);
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
      const compresBar = this.getCompresBar(barInfo.compres, safety);
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
      if (side === "小判") {
        sideBar = this.getHorizontalOvalSideBar(
          barInfo.sidebar,
          safety,
          tension,
          compres,
          h
        );
      } else {
        sideBar = this.getSideBar(
          barInfo.sidebar,
          safety
        );
      }
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

    const fsy = this.getFsyk(
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

  // 矩形、Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar(
    barInfo: any,
    safety: any
  ): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    if (barInfo === null) {
      return result; // 側方鉄筋の入力が無い場合
    }

    // 鉄筋強度
    const fsy1 = this.getFsyk(
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

  // 角度をラジアンに変換
  private Radians(degree: number) {
    return this.section.Radians(degree);
  }

  // 鉄筋の情報を返す
  private getInputData(shapeName: string, index: number, side: string, b: number, h: number = null): any {
    let result = {};

    const bar = this.bars.getCalcData(index);

    let tension: any, compres: any = null, sidebar: any = null;

    switch (shapeName) {
      case "Circle": // 円形
      case "Ring": // 円環
        tension = this.rebarInfo(bar.rebar1);
        if(tension === null){
          throw("引張鉄筋情報がありません");
        }
        if(tension.rebar_ss === null){
          const D = h - tension.dsc * 2;
          tension.rebar_ss = D / tension.line;
        }
        break;

      case "VerticalOval": // 鉛直方向小判形
        tension = this.rebarInfo(bar.rebar1);
        compres = this.rebarInfo(bar.rebar2);
        if(tension === null){
          throw("引張鉄筋情報がありません");
        }
        if(tension.rebar_ss === null){
          const D = h - tension.dsc * 2;
          tension.rebar_ss = D / tension.line;
        }
        sidebar = this.sideInfo(bar.sidebar, tension.dsc, compres.dsc, h);
        break;

      case "HorizontalOval": // 水平方向小判形
        tension = this.rebarInfo(bar.rebar1);
        compres = this.rebarInfo(bar.rebar2);
        if(tension === null){
          throw("引張鉄筋情報がありません");
        }
        if(tension.rebar_ss === null){
          tension.rebar_ss = (b - h) / tension.line;
        }
        sidebar = this.sideInfo(bar.sidebar, tension.dsc, compres.dsc, h);
        break;

      case "Rectangle": // 矩形
      case "Tsection": // T形
      case "InvertedTsection": // 逆T形
        switch (side) {
          case "上側引張":
          case "小判":
            tension = this.rebarInfo(bar.rebar1);
            compres = this.rebarInfo(bar.rebar2);
            break;
          case "下側引張":
            tension = this.rebarInfo(bar.rebar2);
            compres = this.rebarInfo(bar.rebar1);
            break;
        }
        if(tension === null){
          const bar = this.bars.getCalcData(index);
          throw("引張鉄筋情報がありません");
        }
        if(tension.rebar_ss === null){
          tension.rebar_ss = b / tension.line;
        }
        sidebar = this.sideInfo(bar.sidebar, tension.dsc, compres.dsc, h);
        break;

      default:
        throw("断面形状：" + shapeName + " は適切ではありません。");
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

  private sideInfo(barInfo: any, dst: number, dsc: number, height: number){

    if(height===null){
      return null; // 円形など側鉄筋を用いない形状はスキップ
    }

    // 鉄筋径の入力が ない場合は スキップ
    if (barInfo.side_dia === null) {
      return null;
    }
    const dia = Math.abs(barInfo.side_dia);

    // 異形鉄筋:D, 丸鋼: R
    const mark = barInfo.rebar_dia > 0 ? "D" : "R";

    // 鉄筋段数
    const n = barInfo.side_n;
    if (n === 0) {
      return null; // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.helper.toNumber(space) === null) {
      space = (height - dst - dsc) / (n + 1);
    }

    // 鉄筋かぶり
    let dse = barInfo.side_cover;
    if (this.helper.toNumber(dse) === null) {
      dse = dsc + space;
    }

    // 1段当りの本数
    const line = 2;

    return {
      mark,
      side_dia: dia,
      n,
      space,
      dse,
      line
    }
  }

  // 照査表における 引張鉄筋情報を取得
  public getResult(target: string, shape: any, res: any, safety: any): any {

    const result = {
      Ast: null,
      AstString: null,
      dst: null,
      AstCos: null,

      Asc: null,
      AscString: null,
      dsc: null,
      AscCos: null,

      Ase: null,
      AseString: null,
      dse: null,

      fsy: null,
      Es: null,
      fsd: null,
      rs: null,
      fsu: null,

      tan: null
    };

    // ここから
    const post = this.getPostData(shape, res.index, res.side, shape.shape, safety)


    const bar = this.getInputData(shape.shape, res.index, res.side, shape.B, shape.H);
    for(const key of Object.keys(bar)){
      result[key] = bar[key];
    }

    /////////////// 引張鉄筋 ///////////////
    const fsyt = this.getFsyk(bar.tension.rebar_dia, safety.material_bar);
    if (fsyt.fsy === 235) {
      bar.tension.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
    }
    const mark = bar.tension.mark === "R" ? "φ" : "D";
    const AstDia = mark + bar.tension.rebar_dia;
    let rebar_n = bar.tension.rebar_n;


    if(target === 'Vd') {
      // せん断照査における円形の引張鉄筋は、矩形換算時の鉄筋量
      switch(shape.shape){
        case "Circle":  // 円形
        case "Ring":    // 円環
          // const VydBH = this.section.getShape(shape.shape, shape, 'Vd', res.index);
          rebar_n = rebar_n / 4;
        break;
        case "VerticalOval": // 鉛直方向小判形
          rebar_n = rebar_n / 2;
        break;
      }
      const Aw = this.stirrupInfo(bar, safety)
      for(const key of Object.keys(Aw)){
        result[key] = Aw[key];
      }
    }

    const Astx: number =
      this.helper.getAs(AstDia) * rebar_n * bar.tension.cos;
    const dstx: number = this.getBarCenterPosition(
      bar.tension.dsc,
      bar.tension.rebar_n,
      bar.tension.line,
      bar.tension.space,
      bar.tension.cos
    );

    result.Ast = Astx;
    result.AstString = AstDia + "-" + rebar_n + "本";
    result.dst = dstx;

    /////////////// 圧縮鉄筋 ///////////////
    if (safety.safety_factor.range >= 2 && bar.compres != null) {
      const fsyc = this.getFsyk(
        bar.compres.rebar_dia,
        safety.material_bar
      );
      if (fsyc.fsy === 235) {
        bar.compres.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
      }
      const markc = bar.compres.mark === "R" ? "φ" : "D";
      const AscDia = markc + bar.compres.rebar_dia;
      const Ascx: number =
        this.helper.getAs(AscDia) * bar.compres.rebar_n * bar.compres.cos;
      const dscx: number = this.getBarCenterPosition(
        bar.compres.dsc,
        bar.compres.rebar_n,
        bar.compres.line,
        bar.compres.space,
        bar.compres.cos
      );

      result.Asc = Ascx;
      result.AscString = AscDia + "-" + bar.compres.rebar_n + "本";
      result.dsc = dscx;
    }

    /////////////// 側面鉄筋 ///////////////
    if (safety.safety_factor.range >= 3 && bar.sidebar != null) {
      const dia = Math.abs(bar.sidebar.side_dia);
      const fsye = this.getFsyk(dia, safety.material_bar, "sidebar");
      let marke = "D";
      if (fsye.fsy === 235 || bar.sidebar.side_dia < 0) {
        marke = "φ"; // 鉄筋強度が 235 なら 丸鋼
      }
      const Ase = marke + bar.sidebar.side_dia;
      const Asex: number = this.helper.getAs(Ase) * bar.sidebar.side_n;
      const dsex: number = this.getBarCenterPosition(
        bar.sidebar.dsc,
        bar.sidebar.side_n,
        bar.sidebar.line,
        bar.sidebar.space,
        bar.sidebar.cos
      );

      result.Ase = Asex;
      result.AseString = Ase + "-" + bar.sidebar.side_n + "段";
      result.dse = dsex;
    }

    result.AstCos = bar.tension.cos;
    if(bar.compres !== null){
      result.AscCos = this.helper.toNumber(bar.compres.cos);
    }

    // 照査表における 鉄筋強度情報を取得
    result.fsy = fsyt.fsy;
    result.Es = 200;
    result.fsd = fsyt.fsy / safety.safety_factor.rs;

    result.rs = safety.safety_factor.rs;

    result.fsu = fsyt.fsu;

    return result;
  }

  // せん断補強鉄筋量の情報を返す
  private stirrupInfo( bar: any, safety: any): any {

    const result = {

      stirrup_dia: null,
      stirrup_n: null,

      Aw: null,
      AwString: null,
      deg: null,
      Ss: null,

      fwyd: null,
      fwud: null,
      rs: null,

      tan: null
    };

    // 鉄筋径
    if (this.helper.toNumber(bar.stirrup.stirrup_dia) === null) {
      return result;
    }
    result.stirrup_dia = Math.abs(bar.stirrup.stirrup_dia);

    // 異形鉄筋:D, 丸鋼: R
    let mark = bar.stirrup.stirrup_dia > 0 ? "D" : "R";

    // 鉄筋本数
    result.stirrup_n = this.helper.toNumber(bar.stirrup.stirrup_n);
    if (result.stirrup_n === null) {
      result.stirrup_n = 0;
    }

    result.Ss = this.helper.toNumber(bar.stirrup.stirrup_ss);
    if (result.Ss === null) {
      result.Ss = Number.MAX_VALUE;
    }

    const fwyd = this.getFsyk(result.stirrup_dia, safety.material_bar, "stirrup");
    if (fwyd.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      mark = "R";
    }

    const dia: string = mark + result.stirrup_dia;
    const As: number = this.helper.getAs(dia);

    result.Aw = As * result.stirrup_n;
    if(!(result.Aw === 0)){
      result.AwString = dia + "-" + result.stirrup_n + "本";
    }

    result.fwyd = fwyd.fsy;
    result.fwud = fwyd.fsu;
    result.rs = safety.safety_factor.rs;

    let tan = this.helper.toNumber(bar.tan);
    if (tan === null) {
      tan = 0;
    }
    result.tan = tan;

    return result;
  }

  // 鉄筋強度の情報を返す
  public getFsyk(
    rebar_dia: number,
    material_bar: any,
    key: string = "tensionBar"
  ): any {
    let result = {
      fsy: null,
      fsu: null,
      id: "",
    };

    if (rebar_dia <= material_bar[0].separate) {
      result.fsy = this.helper.toNumber(material_bar[0][key].fsy);
      result.fsu = this.helper.toNumber(material_bar[0][key].fsu);
      result.id = "1";
    } else {
      result.fsy = this.helper.toNumber(material_bar[1][key].fsy);
      result.fsu = this.helper.toNumber(material_bar[1][key].fsu);
      result.id = "2";
    }

    return result;
  }

  // 鉄筋の重心位置を求める
  private getBarCenterPosition(
    cover: number,
    n: number,
    line: number,
    space: number,
    cos: number
  ): number {
    // 計算する必要のない場合の処理
    if (cover === null) {
      return 0;
    }
    if (n === null || n <= 0) {
      return cover;
    }
    if (line === null || line <= 0) {
      return cover;
    }
    if (space === null || space <= 0) {
      return cover;
    }
    if (n < line) {
      return cover;
    }
    // 鉄筋の重心位置を計算する
    const steps: number = Math.ceil(n / line); // 鉄筋段数
    let reNum: number = n;
    let PosNum: number = 0;
    for (let i = 0; i < steps; i++) {
      const pos = cover + i * space;
      const num: number = Math.min(line, reNum);
      PosNum += pos * num;
      reNum -= line;
    }
    let result: number = PosNum / n;
    result /= cos;
    return result;
  }

}
