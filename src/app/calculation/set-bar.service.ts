import { Injectable } from "@angular/core";
import { InputBarsService } from "../components/bars/bars.service";
import { DataHelperModule } from "../providers/data-helper.module";

@Injectable({
  providedIn: "root",
})
export class SetBarService {
  constructor(
    private bars: InputBarsService,
    private helper: DataHelperModule
  ) { }

  // 鉄筋情報を集計する
  // member: 部材・断面情報
  // position: ハンチの情報
  // force: 荷重の情報
  // safety: 安全係数の情報
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

    /*/ 鉄筋強度
    let fsy: number;
    let ElasticID: string ;
    if (barInfo.side_dia < materialInfo[0].separate) {
      fsy = this.helper.toNumber(materialInfo[0].sidebar.fsy);
      ElasticID = 's1';
    } else {
      fsy = this.helper.toNumber(materialInfo[1].sidebar.fsy);
      ElasticID = 's2';
    }
    if (fsy === null) {
      return new Array();
    }
    */

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
    //let Dsn: number = 0;
    //let Num: number = 0;
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

      //Num += line;
      //Dsn += dt * line;
    }

    /*/ 印刷用の変数に登録
    result['As'] = this.helper.getAs(dia) * n;
    result['AsString'] = dia + '-' + n + '段';
    result['ds'] = Dsn / Num;
    */

    return result;
  }

  // 縦小判形の 鉄筋のPOST用 データを登録する。
  public getVerticalOvalBar(member: any, index: number, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {},
    };

    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const barInfo = this.getAs("VerticalOval", index, "小判", b, h);
    const tension: any = barInfo.tension;
    const compres: any = barInfo.compres;
    const sideBar = barInfo.sidebar;
    /*
    const tension: any = bar.rebar1;
    const compres: any = bar.rebar2;

    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(tension.rebar_dia) === null) {
      return result;
    }
    if (this.helper.toNumber(compres.rebar_dia) === null) {
      compres.rebar_dia = tension.rebar_dia;
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n1 = this.helper.toNumber(tension.rebar_n);
    if (rebar_n1 === null) {
      return result;
    }
    let rebar_n2 = this.helper.toNumber(compres.rebar_n);
    if (rebar_n2 === null) {
      rebar_n2 = rebar_n1;
    }

    // 1段当りの本数
    let line1: number = this.helper.toNumber(tension.rebar_lines);
    if (line1 === null) {
      line1 = rebar_n1;
    }
    let line2: number = this.helper.toNumber(compres.rebar_lines);
    if (line2 === null) {
      line2 = rebar_n2;
    }

    // 鉄筋段数
    const n1: number = Math.ceil(line1 / rebar_n1);
    const n2: number = Math.ceil(line2 / rebar_n2);

    // 鉄筋アキ
    let space1: number = this.helper.toNumber(tension.rebar_space);
    if (space1 === null) {
      space1 = 0;
    }
    let space2: number = this.helper.toNumber(compres.rebar_space);
    if (space2 === null) {
      space2 = 0;
    }
    // 鉄筋かぶり
    let dsc1 = this.helper.toNumber(tension.rebar_cover);
    if (dsc1 === null) {
      dsc1 = 0;
    }
    let dsc2 = this.helper.toNumber(compres.rebar_cover);
    if (dsc2 === null) {
      dsc2 = 0;
    }
*/
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
      /*
      result['Asc'] = this.helper.getAs(dia2) * rebar_n2;
      result['AscString'] = dia2 + '-' + rebar_n2 + '本';
      result['dsc'] = this.getBarCenterPosition(dsc2, rebar_n2, line2, space2, 1);
*/
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    if (safety.safety_factor.range >= 3) {
      const rebar = this.getSideBar(sideBar, safety); //, h - b, 0, 0);
      sideBarList = rebar.Steels;
      for (const elastic of rebar.SteelElastic) {
        result.SteelElastic.push(elastic);
      }

      /*/ 印刷用の変数に登録
      result['Ase'] = rebar['As'];
      result['AseString'] = rebar['AsString'];
      result['dse'] = rebar['ds'];
      */
    }

    // 引張（下側）鉄筋配置
    const tensionBarList: any[] = new Array();

    // let nAs: number = 0;
    // let nDepth: number = 0;
    // const As: number = this.helper.getAs(dia1);

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
        // nAs += As * 1;
        // nDepth += As * 1 * dst;
      }
    }
    /*
    result['Ast-n'] = n1; // ひび割れの検討k3 に用いる鉄筋段数
    result['Ast-c'] = dsc1 - (tension.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-φ'] = tension.rebar_dia; // ひび割れの検討 に用いる鉄筋径
    let Cs: number = this.helper.toNumber(tension.rebar_ss);
    if (Cs === null) {
      Cs = (h - (tension.dsc * 2)) * Math.PI / tension.line;
    }
    result['Ast-Cs'] = Cs; // ひび割れの検討 に用いる鉄筋間隔
    result['Vyd_d'] = nDepth / nAs;
    result['Vyd_Ast'] = nAs;

    // 印刷用の変数に登録
    result['fsu'] = fsu1;
    result['fsy'] = fsy1;
    result['rs'] = rs;
    result['Es'] = 200;
    */

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

    /*/ 印刷用の変数に登録
    result['Ast'] = this.helper.getAs(dia1) * rebar_n1;
    result['AstString'] = dia1 + '-' + rebar_n1 + '本';
    result['dst'] = this.getBarCenterPosition(dsc1, rebar_n1, line1, space1, 1);
    result['Ast-c'] = dsc1 - (tension.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-Cs'] = tension.rebar_ss; // ひび割れの検討 に用いる鉄筋間隔
    result['Ast-φ'] = tension.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    const Aw: any = this.setAwPrintData(bar.starrup, safety.material_bar);
    if (Aw !== null) {
      result['AW-φ'] = Aw['AW-φ'];
      result['Aw'] = Aw.Aw;
      result['AwString'] = Aw.AwString;
      result['fwyd'] = Aw.fwyd;
      result['fwud'] = Aw.fwud;
      result['deg'] = Aw.deg;
      result['Ss'] = Aw.Ss;
    }
    */
    return result;
  }

  // 円形の 鉄筋のPOST用 データを登録する。
  public getCircleBar(
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
    
    
    const barInfo = this.getAs("Circle", index, side, h);
    /* const barInfo: any = bar.rebar1;

    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(barInfo.rebar_dia) === null) {
      return result;
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.helper.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      return result;
    }

    // 1段当りの本数
    let line: number = this.helper.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const n: number = Math.ceil(line / rebar_n);

    // 鉄筋アキ
    let space: number = this.helper.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.helper.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }
    */

    /*/ 鉄筋強度
    let fsy: number;
    let fsu: number;
    if (barInfo.rebar_dia <= safety.material_bar[0].separate) {
      fsy = this.helper.toNumber(safety.material_bar[0].tensionBar.fsy);
      fsu = this.helper.toNumber(safety.material_bar[0].tensionBar.fsu);
    } else {
      fsy = this.helper.toNumber(safety.material_bar[1].tensionBar.fsy);
      fsu = this.helper.toNumber(safety.material_bar[1].tensionBar.fsu);
    }
    if (fsy === null) {
      return result;
    }
*/
    const fsy = this.getFsyk(
      barInfo.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    const id = "s" + fsy.id;

    // 鉄筋径
    let dia: string = barInfo.mark + barInfo.rebar_dia;
    if (fsy.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + barInfo.rebar_dia;
    }


    // let nAs: number = 0;
    // let nDepth: number = 0;
    // const As: number = this.helper.getAs(dia);

    for (let i = 0; i < barInfo.n; i++) {
      const Depth = barInfo.dsc + i * barInfo.space;
      const Rt: number = h - Depth * 2; // 鉄筋直径
      const num = barInfo.rebar_n - barInfo.line * i; // 鉄筋本数
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
          ElasticID: "s", // 材料番号
        };
        result.Steels.push(Steel1);
        // if (tensionBar === true) {
        //   nAs += As * 1;
        //   nDepth += As * dst;
        // }
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

    /*/ 印刷用の変数に登録
    result['Vyd_d'] = nDepth / nAs;
    result['Vyd_Ast'] = nAs;
    const vyd_n: number = Math.round(nAs / As * 100) / 100;
    result['Vyd_AstString'] = dia + '-' + vyd_n + '本';

    result['Ast'] = this.helper.getAs(dia) * barInfo.rebar_n;
    result['AstString'] = dia + '-' + barInfo.rebar_n.toString() + '本';
    result['dst'] = this.getBarCenterPosition(barInfo.dsc, barInfo.rebar_n, barInfo.line, barInfo.space, 1);

    result['Ast-n'] = barInfo.n; // ひび割れの検討k3 に用いる鉄筋段数
    result['Ast-c'] = barInfo.dsc - (barInfo.rebar_dia / 2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-φ'] = barInfo.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    let Cs: number = this.helper.toNumber(barInfo.rebar_ss);
    if (Cs === null) {
      Cs = (h - (barInfo.dsc * 2)) * Math.PI / barInfo.line;
    }
    result['Ast-Cs'] = Cs; // ひび割れの検討 に用いる鉄筋間隔

    result['fsu'] = fsu;
    result['fsy'] = fsy;
    result['rs'] = rs;
    result['Es'] = 200;

    const Aw: any = this.setAwPrintData(barInfo.starrup, safety.material_bar);
    if (Aw !== null) {
      result['AW-φ'] = Aw['AW-φ'];
      result['Aw'] = Aw.Aw;
      result['AwString'] = Aw.AwString;
      result['fwyd'] = Aw.fwyd;
      result['fwud'] = Aw.fwud;
      result['deg'] = Aw.deg;
      result['Ss'] = Aw.Ss;
    }
    */

    return result;
  }

  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  public getRectBar(
    member: any,
    index: number,
    side: string,
    safety: any
  ): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    const h: number = member.H;
    const b: number = member.B;
    const barInfo = this.getAs("Rectangle", index, side, b, h);

    let tension: any = barInfo.tension;
    let compres: any = barInfo.compres;

    /*
    switch (side) {
      case '上側引張':
        tension = bar.rebar1;
        compres = bar.rebar2;
        break;
      case '下側引張':
        tension = bar.rebar2;
        compres = bar.rebar1;
        break;
      case '小判':
        tension = bar.rebar1;
        compres = bar.rebar2;
        break;
    }
    */

    // 基準となる 鉄筋強度
    // const rs = safety.safety_factor.rs;

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
      /*
      result['Asc'] = compresBar['As'];
      result['AscString'] = compresBar['AsString'];
      result['AscCos'] = compresBar['cos'];
      result['dsc'] = compresBar['ds'];
      */
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
    /*
    // 印刷用の変数に登録
    result['fsu'] = tensionBar['fsu'];
    result['fsy'] = tensionBar['fsy'];
    result['rs'] = rs;
    result['Es'] = 200;
    result['Ast'] = tensionBar['As'];
    result['AstCos'] = tensionBar['cos'];
    result['AstString'] = tensionBar['AsString'];
    result['dst'] = tensionBar['ds'];

    result['Ast-n'] = tensionBar.n; // ひび割れの検討k3 に用いる鉄筋段数
    result['Ast-c'] = tensionBar.c - (tensionBar['φ'] / 2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-Cs'] = tensionBar.Cs; // ひび割れの検討 に用いる鉄筋間隔
    result['Ast-φ'] = tensionBar['φ']; // ひび割れの検討 に用いる鉄筋径
    result['Vyd_d'] = height - tensionBar.ds;
    result['Vyd_Ast'] = tensionBar.As;


    if (sideBarList.length > 0) { // 印刷用の変数に登録
      result['Ase'] = sideBar['As'];
      result['AseString'] = sideBar['AsString'];
      result['dse'] = sideBar['ds'];
    }

    const Aw: any = this.setAwPrintData(bar.starrup, safety.material_bar);
    if (Aw !== null) {
      result['AW-φ'] = Aw['AW-φ'];
      result['Aw'] = Aw.Aw;
      result['AwString'] = Aw.AwString;
      result['fwyd'] = Aw.fwyd;
      result['fwud'] = Aw.fwud;
      result['deg'] = Aw.deg;
      result['Ss'] = Aw.Ss;
    }
*/
    return result;
  }

  // 矩形。Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    /*
    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(barInfo.rebar_dia) === null) {
      return result;
    }

    //鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.helper.toNumber(barInfo.rebar_n );
    if (rebar_n === null) {
      return result;
    }

    const materialInfo = safety.material_bar;

    // 1段当りの本数
    let line: number = this.helper.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const nn: number = rebar_n / line;
    const n: number = Math.ceil(nn);

    // 鉄筋アキ
    let space: number = this.helper.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.helper.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }
*/
    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;
    /*
    // 鉄筋強度
    let fsy: number;
    let fsu: number;
    let ElasticID: string;
    if (barInfo.rebar_dia <= materialInfo[0].separate) {
      fsy = this.helper.toNumber(materialInfo[0].tensionBar.fsy);
      fsu = this.helper.toNumber(materialInfo[0].tensionBar.fsu);
      ElasticID = 't1';
    } else {
      fsy = this.helper.toNumber(materialInfo[1].tensionBar.fsy);
      fsu = this.helper.toNumber(materialInfo[1].tensionBar.fsu);
      ElasticID = 't2';
    }
    if (fsy === null) {
      return result;
    }
*/
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

    /*/ cos に入力があれば本数に反映。鉄筋の本数の入力が ない場合は スキップ
    let cos = this.helper.toNumber(barInfo.cos);
    if (cos === null) {
      cos = 1;
    }
    */

    // 鉄筋情報を登録
    let rebar_n = barInfo.rebar_n;
    for (let i = 0; i < barInfo.n; i++) {
      const dst: number = barInfo.dsc + i * barInfo.space;
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

    /*/ 印刷用の変数に登録
    result['fsy'] =  fsy;
    result['fsu'] =  fsu;
    result['As'] =  this.helper.getAs(dia) * barInfo.rebar_n * cos;
    result['cos'] =  cos;
    result['AsString'] =  dia + '-' + barInfo.rebar_n + '本';
    result['ds'] =  this.getBarCenterPosition(dsc, barInfo.rebar_n, line, space, cos);
    result['n'] =  nn; // ひび割れの検討k3 に用いる鉄筋段数
    result['c'] =  dsc; // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Cs'] =  barInfo.rebar_ss; // ひび割れの検討 に用いる鉄筋間隔
    result['φ'] =  barInfo.rebar_dia; // ひび割れの検討 に用いる鉄筋径
    */

    return result;safety
  }

  // 矩形。Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
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
/*
    // 鉄筋径の入力が ない場合は スキップ
    if (barInfo.side_dia === null) {
      return result;
    }
    // 鉄筋段数
    const n = barInfo.side_n;
    if (n === 0) {
      return result; // 鉄筋段数の入力が 0 の場合は スキップ
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
*/

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

    /*/ 印刷用の変数に登録
    result['As'] = this.helper.getAs(dia) * n;
    result['AsString'] = dia + '-' + n + '段';
    result['ds'] = this.getBarCenterPosition(dse, n, 1, space, 1);
    */

    return result;
  }

  // 角度をラジアンに変換
  public Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

  // 軸方向鉄筋の情報を返す
  public getAs(shapeName: string, index: number, side: string, b: number, h: number = null): any {
    let result = {};

    const bar = this.bars.getCalcData(index);

    let tension: any, compres: any;

    switch (shapeName) {
      case "Circle": // 円形
      case "Ring": // 円環
        tension = this.getRebarInfo(bar.rebar1);
        if(tension.rebar_ss === null){
          const D = h - tension.dsc * 2; 
          tension.rebar_ss = D / tension.line; 
        }
        result = { tension };
        break;

      case "VerticalOval": // 鉛直方向小判形
        tension = this.getRebarInfo(bar.rebar1);
        compres = this.getRebarInfo(bar.rebar2);
        if(tension.rebar_ss === null){
          const D = h - tension.dsc * 2; 
          tension.rebar_ss = D / tension.line; 
        }
        break;

      case "HorizontalOval": // 水平方向小判形
        tension = this.getRebarInfo(bar.rebar1);
        compres = this.getRebarInfo(bar.rebar2);
        if(tension.rebar_ss === null){
          tension.rebar_ss = (b - h) / tension.line;
        }
        break;

      case "Rectangle": // 矩形
      case "Tsection": // T形
      case "InvertedTsection": // 逆T形
        switch (side) {
          case "上側引張":
          case "小判":
            tension = this.getRebarInfo(bar.rebar1);
            compres = this.getRebarInfo(bar.rebar2);
            break;
          case "下側引張":
            tension = this.getRebarInfo(bar.rebar2);
            compres = this.getRebarInfo(bar.rebar1);
            break;
        }
        if(tension.rebar_ss === null){
          tension.rebar_ss = b / tension.line;
        }

        const sidebar = this.getSideInfo(bar.sidebar, tension.dsc, compres.dsc, h);

        result = { tension, compres, sidebar };
        break;

      default:
        console.log("断面形状：" + shapeName + " は適切ではありません。");
        return null;
    }
    return result;
  }

  // 圧縮・引張主鉄筋の情報を返す
  private getRebarInfo(barInfo: any): any {
    // 鉄筋径
    if (this.helper.toNumber(barInfo.rebar_dia) === null) {
      return null;
    }
    const dia = Math.abs(barInfo.rebar_dia);

    // 異形鉄筋:D, 丸鋼: R
    const mark = barInfo.rebar_dia > 0 ? "D" : "R";

    // 鉄筋全本数
    const rebar_n = this.helper.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      return null;
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

  private getSideInfo(barInfo: any, dst: number, dsc: number, height: number){
    
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
  public getResult(
    target: string,
    shape: any,
    res: any,
    safety: any
  ): any {

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
      fsu: null
    };

    const bar = this.getAs(shape.shape, res.index, res.side, shape.B, shape.H);
    for(const key of Object.keys(bar)){
      result[key] = bar[key];
    }

    /////////////// 引張鉄筋 ///////////////
    const fsyt = this.getFsyk(bar.tension.rebar_dia, safety.material_bar);
    if (fsyt.fsy === 235) {
      bar.tension.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
    }
    const markt = bar.tension.mark === "R" ? "φ" : "D";
    const AstDia = markt + bar.tension.rebar_dia;
    const Astx: number =
      this.helper.getAs(AstDia) * bar.tension.rebar_n * bar.tension.cos;
    const dstx: number = this.getBarCenterPosition(
      bar.tension.dsc,
      bar.tension.rebar_n,
      bar.tension.line,
      bar.tension.space,
      bar.tension.cos
    );

    result.Ast = Astx;
    result.AstString = AstDia + "-" + bar.tension.rebar_n + "本";
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
    result.AscCos = bar.compres.cos;

    // 照査表における 鉄筋強度情報を取得
    if ("fsy" in fsyt) {
      result.fsy = fsyt.fsy;
      result.Es = 200;
      result.fsd = fsyt.fsy / safety.safety_factor.rs;
    }

    if ("rs" in safety.safety_factor) {
      result.rs = safety.safety_factor.rs;
    }

    if ("fsu" in fsyt) {
      result.fsu = fsyt.fsu;
    }

    return result;
  }

  // せん断補強鉄筋量の情報を返す
  public getAw(shapeName: string, index: number, side: string): any {
    let result = {};
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
  public getBarCenterPosition(
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

  private setAwPrintData(starrup: any, materialInfo: any[]): any {
    // エラーチェック
    if (starrup.stirrup_dia === null) {
      return null;
    }
    if (starrup.stirrup_n === null) {
      return null;
    }
    if (starrup.stirrup_n === 0) {
      return null;
    }
    if (starrup.stirrup_ss === null) {
      return null;
    }
    if (starrup.stirrup_ss === 0) {
      return null;
    }

    const result = {
      "AW-φ": 0,
      Aw: 0,
      AwString: "",
      fwyd: 0,
      fwud: 0,
      deg: 90,
      Ss: 0,
    };

    let fwyd: number;
    let fwud: number;
    if (starrup.stirrup_dia <= materialInfo[0].separate) {
      fwyd = this.helper.toNumber(materialInfo[0].stirrup.fsy);
      fwud = this.helper.toNumber(materialInfo[0].stirrup.fsu);
    } else {
      fwyd = this.helper.toNumber(materialInfo[1].stirrup.fsy);
      fwud = this.helper.toNumber(materialInfo[1].stirrup.fsu);
    }
    if (fwyd === null) {
      return null;
    }

    let dia: string = "D" + starrup.stirrup_dia;
    if (fwyd === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = "R" + starrup.stirrup_dia;
    }
    const As: number = this.helper.getAs(dia);
    const n: number = starrup.stirrup_n;
    result["AW-φ"] = starrup.stirrup_dia;
    result.Aw = As * n;
    result.AwString = dia + "-" + n + "本";
    result.Ss = starrup.stirrup_ss;
    result.fwyd = fwyd;
    result.fwud = fwud;

    return result;
  }



}
