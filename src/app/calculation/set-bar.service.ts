import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class SetBarService {

  constructor(private save: SaveDataService) {
  }

  // 横小判形における 側面鉄筋 の 鉄筋情報を生成する関数
  private getHorizontalOvalSideBar(
    barInfo: any,
    materialInfo: any[],
    tensionBar: any,
    compresBar: any,
    height: number,
    printSideBar: any): any[] {

    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.side_dia) === null) {
      return new Array();
    }
    // 鉄筋段数
    const n = barInfo.sidebar_n;
    if (this.save.toNumber(n) === null) {
      return new Array(); // 鉄筋段数の入力が ない場合は スキップ
    }
    if (n === 0) {
      return new Array(); // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 主鉄筋のかぶり
    let dst = this.save.toNumber(tensionBar.rebar_cover);
    if (dst === null) {
      dst = 0;
    }
    let dsc = this.save.toNumber(compresBar.rebar_cover);
    if (dsc === null) {
      dsc = dst;
    }

    // 鉄筋配置直径
    const Rt: number = height - (dst + dsc);

    // 鉄筋配置弧の長さ
    const arcLength: number = Rt * Math.PI / 2;

    // 側方鉄筋スタート位置
    let dse = barInfo.side_cover;
    if (this.save.toNumber(dse) === null) {
      dse = arcLength / (n + 1);
    }

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.save.toNumber(space) === null) {
      space = arcLength / (n + 1);
    }

    // 弧の長さより長くなってしまった場合は調整する
    if (dse + space * n > arcLength) {
      space = (arcLength - dse * 2) / (n - 1);
    }

    // 1段当りの本数
    const line = 2;

    // 鉄筋強度
    let fsy: number;
    let ElasticID: string ;
    if (barInfo.side_dia < materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[2].fsy1);
      ElasticID = 's1';
    } else {
      fsy = this.save.toNumber(materialInfo[2].fsy2);
      ElasticID = 's2';
    }
    if (fsy === null) {
      return new Array();
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.side_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.side_dia;
    }

    // 鉄筋情報を登録
    const start_deg: number = 360 * dse / (Math.PI * Rt);   // 鉄筋配置開始角度
    const steps_deg: number = 360 * space / (Math.PI * Rt); // 鉄筋配置角度
    const end_deg: number = start_deg + steps_deg * (n - 1);    // 鉄筋配置終了角度
    let Dsn: number = 0;
    let Num: number = 0;
    for (let deg = start_deg; deg <= end_deg; deg += steps_deg) {

      const dst = (Rt / 2) - (Math.cos(this.Radians(deg)) * Rt / 2) + dsc;

      const Steel1 = {
        Depth: dst,
        i: dia,
        n: line,
        IsTensionBar: false,
        ElasticID: ElasticID,
        fsyk: fsy
      };
      result.push(Steel1);

      Num += line;
      Dsn += dst * line;
    }

    // 印刷用の変数に登録
    printSideBar['As'] = this.save.getAs(dia) * n;
    printSideBar['AsString'] = dia + '-' + n + '段';
    printSideBar['ds'] = Dsn / Num;

    return result;
  }

  // 縦小判形の 鉄筋のPOST用 データを登録する。
  public getVerticalOvalBar(position: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {}
    };

    let h: number = this.save.toNumber(position.memberInfo.H);
    let b: number = this.save.toNumber(position.memberInfo.B);

    let tensionBar: any = position.barData.rebar1;
    let compresBar: any = position.barData.rebar2;
    const sideBar = position.barData.sidebar;

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(tensionBar.rebar_dia) === null) {
      return result;
    }
    if (this.save.toNumber(compresBar.rebar_dia) === null) {
      compresBar.rebar_dia = tensionBar.rebar_dia;
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n1 = this.save.toNumber(tensionBar.rebar_n);
    if (rebar_n1 === null) {
      return result;
    }
    let rebar_n2 = this.save.toNumber(compresBar.rebar_n);
    if (rebar_n2 === null) {
      rebar_n2 = rebar_n1;
    }

    // 1段当りの本数
    let line1: number = this.save.toNumber(tensionBar.rebar_lines);
    if (line1 === null) {
      line1 = rebar_n1;
    }
    let line2: number = this.save.toNumber(compresBar.rebar_lines);
    if (line2 === null) {
      line2 = rebar_n2;
    }

    // 鉄筋段数
    const n1: number = Math.ceil(line1 / rebar_n1);
    const n2: number = Math.ceil(line2 / rebar_n2);

    // 鉄筋アキ
    let space1: number = this.save.toNumber(tensionBar.rebar_space);
    if (space1 === null) {
      space1 = 0;
    }
    let space2: number = this.save.toNumber(compresBar.rebar_space);
    if (space2 === null) {
      space2 = 0;
    }
    // 鉄筋かぶり
    let dsc1 = this.save.toNumber(tensionBar.rebar_cover);
    if (dsc1 === null) {
      dsc1 = 0;
    }
    let dsc2 = this.save.toNumber(compresBar.rebar_cover);
    if (dsc2 === null) {
      dsc2 = 0;
    }

    // 鉄筋強度
    let fsy1: number;
    let fsu1: number;
    let ElasticID1 : string;
    if (tensionBar.rebar_dia <= position.material_bar[0].fsy1) {
      fsy1 = this.save.toNumber(position.material_bar[1].fsy1);
      fsu1 = this.save.toNumber(position.material_bar[1].fsu1);
      ElasticID1 = 's1';
    } else {
      fsy1 = this.save.toNumber(position.material_bar[1].fsy2);
      fsu1 = this.save.toNumber(position.material_bar[1].fsu2);
      ElasticID1 = 's2';
    }
    if (fsy1 === null) {
      return result;
    }
    let fsy2: number;
    let ElasticID2 : string;
    if (compresBar.rebar_dia <= position.material_bar[0].fsy1) {
      fsy2 = this.save.toNumber(position.material_bar[1].fsy1);
      ElasticID2 = 's1'
    } else {
      fsy2 = this.save.toNumber(position.material_bar[1].fsy2);
      ElasticID2 = 's2'
    }
    if (fsy2 === null) {
      fsy2 = fsy1;
    }

    // 鉄筋径
    let dia1: string = 'D' + tensionBar.rebar_dia;
    let dia2: string = 'D' + compresBar.rebar_dia;
    if (fsy1 === 235) { // 鉄筋強度が 235 なら 丸鋼
      dia1 = 'R' + tensionBar.rebar_dia;
    }
    if (fsy2 === 235) { // 鉄筋強度が 235 なら 丸鋼
      dia2 = 'R' + compresBar.rebar_dia;
    }

    // 圧縮（上側）鉄筋配置
    let compresBarList: any[] = new Array();
    if (position.safety_factor.range >= 2) {

      for (let i = 0; i < n2; i++) {

        const Depth = dsc2 + i * space2;
        const Rt: number = b - (Depth * 2);   // 鉄筋直径
        const steps: number = 180 / (rebar_n2 - line2 * i + 1); // 鉄筋角度間隔

        for (let deg = steps; deg < 180; deg += steps) {
          const dsc = (b / 2) - (Math.sin(this.Radians(deg)) * Rt);
          const Steel1 = {
            Depth: dsc,                // 深さ位置
            i: dia2,                    // 鋼材
            n: 1,                      // 鋼材の本数
            IsTensionBar: false,      // 鋼材の引張降伏着目Flag
            ElasticID: ElasticID2            // 材料番号
          };
          compresBarList.push(Steel1);
        }
      }
      result.PrintData['Asc'] = this.save.getAs(dia2) * rebar_n2;
      result.PrintData['AscString'] = dia2 + '-' + rebar_n2 + '本';
      result.PrintData['dsc'] = this.getBarCenterPosition(dsc2, rebar_n2, line2, space2, 1);
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    const printSideBar = {};
    if (position.safety_factor.range >= 3) {
      sideBarList = this.getSideBar(sideBar, position.material_bar, '', h - b, 0, 0, printSideBar);
      // 印刷用の変数に登録
      result.PrintData['Ase'] = printSideBar['As'];
      result.PrintData['AseString'] = printSideBar['AsString'];
      result.PrintData['dse'] = printSideBar['ds'];
    }

    // 引張（下側）鉄筋配置
    let tensionBarList: any[] = new Array();

    let nAs: number = 0;
    let nDepth: number = 0;
    let As: number = this.save.getAs(dia1);

    for (let i = 0; i < n1; i++) {

      const Depth = dsc1 + i * space1;
      const Rt: number = b - (Depth * 2);   // 鉄筋直径
      const steps: number = 180 / (rebar_n1 - line1 * i + 1); // 鉄筋角度間隔

      for (let deg = steps; deg < 180; deg += steps) {
        const dst = (h - (b / 2)) + (Math.sin(this.Radians(deg)) * Rt);
        const Steel1 = {
          Depth: dst,                // 深さ位置
          i: dia1,                    // 鋼材
          n: 1,                      // 鋼材の本数
          IsTensionBar: true,      // 鋼材の引張降伏着目Flag
          ElasticID: ElasticID1            // 材料番号
        };
        tensionBarList.push(Steel1);
        nAs += As * 1;
        nDepth += As * 1 * dst;
      }
    }
    result.PrintData['Ast-n'] = n1; // ひび割れの検討k3 に用いる鉄筋段数
    result.PrintData['Ast-c'] = dsc1 - (tensionBar.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result.PrintData['Ast-φ'] = tensionBar.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    let Cs: number = this.save.toNumber(tensionBar.rebar_ss);
    if (Cs === null) {
      Cs = (h - (dsc1 * 2)) * Math.PI / line1;
    }
    result.PrintData['Ast-Cs'] = Cs; // ひび割れの検討 に用いる鉄筋間隔
    result.PrintData['Vyd_d'] = nDepth / nAs;
    result.PrintData['Vyd_Ast'] = nAs;

    // 鉄筋強度の入力
    const rs = position.safety_factor.rs;
    const fsk1 = this.save.toNumber(position.material_bar[1].fsy1);
    const fsk2 = this.save.toNumber(position.material_bar[1].fsy2);
    result.SteelElastic.push({
      fsk: fsk1 / rs,
      Es: 200,
      ElasticID: 's1'
    },
    {
      fsk: fsk2 / rs,
      Es: 200,
      ElasticID: 's2'
    });
    // 印刷用の変数に登録
    result.PrintData['fsu'] = fsu1;
    result.PrintData['fsy'] = fsy1;
    result.PrintData['rs'] = rs;
    result.PrintData['Es'] = 200;

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
    // 印刷用の変数に登録
    result.PrintData['Ast'] = this.save.getAs(dia1) * rebar_n1;
    result.PrintData['AstString'] = dia1 + '-' + rebar_n1 + '本';
    result.PrintData['dst'] = this.getBarCenterPosition(dsc1, rebar_n1, line1, space1, 1);
    result.PrintData['Ast-c'] = dsc1 - (tensionBar.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result.PrintData['Ast-Cs'] = tensionBar.rebar_ss; // ひび割れの検討 に用いる鉄筋間隔
    result.PrintData['Ast-φ'] = tensionBar.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    const Aw: any = this.setAwPrintData(position.barData.starrup, position.material_bar);
    if (Aw !== null) {
      result.PrintData['AW-φ'] = Aw['AW-φ'];
      result.PrintData['Aw'] = Aw.Aw;
      result.PrintData['AwString'] = Aw.AwString;
      result.PrintData['fwyd'] = Aw.fwyd;
      result.PrintData['fwud'] = Aw.fwud;
      result.PrintData['deg'] = Aw.deg;
      result.PrintData['Ss'] = Aw.Ss;
    }
    return result;
  }

  // 円形の 鉄筋のPOST用 データを登録する。
  public getCircleBar(position: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {}
    };

    let barInfo: any = position.barData.rebar1;

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.rebar_dia) === null) {
      return result;
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.save.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      return result;
    }

    // 1段当りの本数
    let line: number = this.save.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const n: number = Math.ceil(line / rebar_n);

    // 鉄筋アキ
    let space: number = this.save.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.save.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }

    // 鉄筋強度
    let fsy: number;
    let fsu: number;
    if (barInfo.rebar_dia <= position.material_bar[0].fsy1) {
      fsy = this.save.toNumber(position.material_bar[1].fsy1);
      fsu = this.save.toNumber(position.material_bar[1].fsu1);
    } else {
      fsy = this.save.toNumber(position.material_bar[1].fsy2);
      fsu = this.save.toNumber(position.material_bar[1].fsu2);
    }
    if (fsy === null) {
      return result;
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.rebar_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.rebar_dia;
    }

    // 鉄筋配置
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { 
      h = this.save.toNumber(position.memberInfo.B);
    }
    if (h === null) { return result; }

    let nAs: number = 0;
    let nDepth: number = 0;
    const As: number = this.save.getAs(dia);

    for (let i = 0; i < n; i++) {

      const Depth = dsc + i * space;
      const Rt: number = h - (Depth * 2);   // 鉄筋直径
      const num = rebar_n - line * i;       // 鉄筋本数
      const steps: number = 360 / num;      // 鉄筋角度間隔

      for (let j = 0; j < num; j++ ) {
        const deg = j * steps;
        const dst = (Rt / 2) - (Math.cos(this.Radians(deg)) * Rt / 2) + Depth;
        const tensionBar: boolean = (deg >= 135 && deg <= 225) ? true : false;
        const Steel1 = {
          Depth: dst,                // 深さ位置
          i: dia,                    // 鋼材
          n: 1,                      // 鋼材の本数
          IsTensionBar: tensionBar,  // 鋼材の引張降伏着目Flag
          ElasticID: 's'            // 材料番号
        };
        result.Steels.push(Steel1);
        if (tensionBar === true) {
          nAs += As * 1;
          nDepth += As * dst;
        }
      }
    }

    // 基準となる 鉄筋強度
    const rs = position.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsy / rs,
      Es: 200,
      ElasticID: 's'
    });


    // 印刷用の変数に登録
    result.PrintData['Vyd_d'] = nDepth / nAs;
    result.PrintData['Vyd_Ast'] = nAs;
    const vyd_n: number = nAs / As;
    result.PrintData['Vyd_AstString'] = dia + '-' + vyd_n + '本';

    result.PrintData['Ast'] = this.save.getAs(dia) * rebar_n;
    result.PrintData['AstString'] = dia + '-' + rebar_n.toString() + '本';
    result.PrintData['dst'] = this.getBarCenterPosition(dsc, rebar_n, line, space, 1);

    result.PrintData['Ast-n'] = n; // ひび割れの検討k3 に用いる鉄筋段数
    result.PrintData['Ast-c'] = dsc - (barInfo.rebar_dia / 2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result.PrintData['Ast-φ'] = barInfo.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    let Cs: number = this.save.toNumber(barInfo.rebar_ss);
    if (Cs === null) {
      Cs = (h - (dsc * 2)) * Math.PI / line;
    }
    result.PrintData['Ast-Cs'] = Cs; // ひび割れの検討 に用いる鉄筋間隔

    result.PrintData['fsu'] = fsu;
    result.PrintData['fsy'] = fsy;
    result.PrintData['rs'] = rs;
    result.PrintData['Es'] = 200;

    const Aw: any = this.setAwPrintData(position.barData.starrup, position.material_bar);
    if (Aw !== null) {
      result.PrintData['AW-φ'] = Aw['AW-φ'];
      result.PrintData['Aw'] = Aw.Aw;
      result.PrintData['AwString'] = Aw.AwString;
      result.PrintData['fwyd'] = Aw.fwyd;
      result.PrintData['fwud'] = Aw.fwud;
      result.PrintData['deg'] = Aw.deg;
      result.PrintData['Ss'] = Aw.Ss;
    }
    return result;
  }

  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  public getRectBar(position: any, side: string, height: number): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {}
    };

    let tensionBar: any;
    let compresBar: any;

    switch (side) {
      case '上側引張':
        tensionBar = position.barData.rebar1;
        compresBar = position.barData.rebar2;
        break;
      case '下側引張':
        tensionBar = position.barData.rebar2;
        compresBar = position.barData.rebar1;
        break;
      case '横小判':
        tensionBar = position.barData.rebar1;
        compresBar = position.barData.rebar2;
        break;
    }
    const sideBar = position.barData.sidebar;

    const printTensionBar: any = {};
    const tensionBarList: any[] = this.getCompresBar(tensionBar, position.material_bar, printTensionBar);
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }

    // 圧縮鉄筋 をセットする
    let compresBarList: any[] = new Array();
    const printCompresBar = {};
    const tmpCompresBarList = this.getCompresBar(compresBar, position.material_bar, printCompresBar);
    if (position.safety_factor.range >= 2) {
      compresBarList = tmpCompresBarList;
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    const printSideBar = {};
    if (position.safety_factor.range >= 3) {
      if (side === '横小判') {
        sideBarList = this.getHorizontalOvalSideBar(sideBar, position.material_bar, tensionBar, compresBar, height, printSideBar);
      } else {
        const tensionBarDepth = tensionBarList[tensionBarList.length - 1].Depth;
        let compresBarDepth = 0;
        if(tmpCompresBarList.length > 0){
          compresBarDepth = tmpCompresBarList[tmpCompresBarList.length - 1].Depth;
        }
        sideBarList = this.getSideBar(sideBar, position.material_bar, side,
                                      height, tensionBarDepth, compresBarDepth,
                                      printSideBar);
      }
    }

    // 基準となる 鉄筋強度
    const fsk1 = this.save.toNumber(position.material_bar[1].fsy1);
    const fsk2 = this.save.toNumber(position.material_bar[1].fsy2);
    const rs = position.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsk1 / rs,
      Es: 200,
      ElasticID: 's1'
    },
    {
      fsk: fsk2 / rs,
      Es: 200,
      ElasticID: 's2'
    });

    // 圧縮鉄筋の登録
    let cosAsc: number = this.save.toNumber(compresBar.cos);
    if ( cosAsc === null ) {
      cosAsc = 1;
    }
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
    let cosAst: number = this.save.toNumber(tensionBar.cos);
    if ( cosAst === null ) {
      cosAst = 1;
    }
    for (const Ast of tensionBarList) {
      Ast.n = Ast.n * cosAst;
      Ast.Depth = height - (Ast.Depth / cosAst);
      Ast.IsTensionBar = true;
      result.Steels.push(Ast);
    }

    // 印刷用の変数に登録
    result.PrintData['fsu'] = printTensionBar['fsu'];
    result.PrintData['fsy'] = printTensionBar['fsy'];
    result.PrintData['rs'] = rs;
    result.PrintData['Es'] = 200;
    result.PrintData['Ast'] = printTensionBar['As'];
    result.PrintData['AstCos'] = printTensionBar['cos'];
    result.PrintData['AstString'] = printTensionBar['AsString'];
    result.PrintData['dst'] = printTensionBar['ds'];

    result.PrintData['Ast-n'] = printTensionBar.n; // ひび割れの検討k3 に用いる鉄筋段数
    result.PrintData['Ast-c'] = printTensionBar.c - (printTensionBar['φ'] / 2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result.PrintData['Ast-Cs'] = printTensionBar.Cs; // ひび割れの検討 に用いる鉄筋間隔
    result.PrintData['Ast-φ'] = printTensionBar['φ']; // ひび割れの検討 に用いる鉄筋径
    result.PrintData['Vyd_d'] = height - printTensionBar.ds;
    result.PrintData['Vyd_Ast'] = printTensionBar.As;

    if (compresBarList.length > 0) { // 印刷用の変数に登録
      result.PrintData['Asc'] = printCompresBar['As'];
      result.PrintData['AscString'] = printCompresBar['AsString'];
      result.PrintData['AscCos'] = printCompresBar['cos'];
      result.PrintData['dsc'] = printCompresBar['ds'];
    }

    if (sideBarList.length > 0) { // 印刷用の変数に登録
      result.PrintData['Ase'] = printSideBar['As'];
      result.PrintData['AseString'] = printSideBar['AsString'];
      result.PrintData['dse'] = printSideBar['ds'];
    }

    const Aw: any = this.setAwPrintData(position.barData.starrup, position.material_bar);
    if (Aw !== null) {
      result.PrintData['AW-φ'] = Aw['AW-φ'];
      result.PrintData['Aw'] = Aw.Aw;
      result.PrintData['AwString'] = Aw.AwString;
      result.PrintData['fwyd'] = Aw.fwyd;
      result.PrintData['fwud'] = Aw.fwud;
      result.PrintData['deg'] = Aw.deg;
      result.PrintData['Ss'] = Aw.Ss;
    }

    return result;
  }

  // 矩形。Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any,
                        materialInfo: any[],
                        printTensionBar: any): any[] {

    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.rebar_dia) === null) {
      return new Array();
    }
    
    //鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.save.toNumber(barInfo.rebar_n );
    if (rebar_n === null) {
      return new Array();
    }

    // 1段当りの本数
    let line: number = this.save.toNumber(barInfo.rebar_lines);
    if (line === null) {
      line = rebar_n;
    }

    // 鉄筋段数
    const nn: number = rebar_n / line;
    const n: number = Math.ceil(nn);

    // 鉄筋アキ
    let space: number = this.save.toNumber(barInfo.rebar_space);
    if (space === null) {
      space = 0;
    }

    // 鉄筋かぶり
    let dsc = this.save.toNumber(barInfo.rebar_cover);
    if (dsc === null) {
      dsc = 0;
    }

    // 鉄筋強度
    let fsy: number;
    let fsu: number;
    let ElasticID: string;
    if (barInfo.rebar_dia <= materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[1].fsy1);
      fsu = this.save.toNumber(materialInfo[1].fsu1);
      ElasticID = 's1';
    } else {
      fsy = this.save.toNumber(materialInfo[1].fsy2);
      fsu = this.save.toNumber(materialInfo[1].fsu2);
      ElasticID = 's2';
    }
    if (fsy === null) {
      return new Array();
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.rebar_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.rebar_dia;
    }

    // cos に入力があれば本数に反映。鉄筋の本数の入力が ない場合は スキップ
    let cos = this.save.toNumber(barInfo.cos);
    if (cos === null) {
      cos = 1;
    }
    
    // 鉄筋情報を登録
    for (let i = 0; i < n; i++) {
      const dst: number = dsc + i * space;
      const Steel1 = {
        Depth: dst,
        i: dia,
        n: Math.min(line, rebar_n * cos),
        IsTensionBar: false,
        ElasticID: ElasticID,
        fsyk: fsy
      };
      result.push(Steel1);
      rebar_n = rebar_n - line;
    }

    // 印刷用の変数に登録
    printTensionBar['fsy'] = fsy;
    printTensionBar['fsu'] = fsu;
    printTensionBar['As'] = this.save.getAs(dia) * barInfo.rebar_n * cos;
    printTensionBar['cos'] = cos;
    printTensionBar['AsString'] = dia + '-' + barInfo.rebar_n + '本';
    printTensionBar['ds'] = this.getBarCenterPosition(dsc, barInfo.rebar_n, line, space, cos);
    printTensionBar['n'] = nn; // ひび割れの検討k3 に用いる鉄筋段数
    printTensionBar['c'] = dsc; // ひび割れの検討 に用いる1段目の鉄筋かぶり
    printTensionBar['Cs'] = barInfo.rebar_ss; // ひび割れの検討 に用いる鉄筋間隔
    printTensionBar['φ'] = barInfo.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    return result;
  }

  // 矩形。Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar(barInfo: any, materialInfo: any[],
                     side: string, height: number,
                     dst: number, dsc: number,
                     printSideBar: any): any[] {

    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.side_dia) === null) {
      return new Array();
    }
    // 鉄筋段数
    const n = barInfo.side_n;
    if (this.save.toNumber(n) === null) {
      return new Array(); // 鉄筋段数の入力が ない場合は スキップ
    }
    if (n === 0) {
      return new Array(); // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.save.toNumber(space) === null) {
      space = (height - dst - dsc) / (n + 1);
    }

    // 鉄筋かぶり
    let dse = barInfo.side_cover;
    if (this.save.toNumber(dse) === null) {
      dse = dsc + space;
    }

    // 1段当りの本数
    const line = 2;

    // 鉄筋強度
    let fsy: number;
    let ElasticID: string;
    if (barInfo.side_dia < materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[2].fsy1);
      ElasticID = 's1';
    } else {
      fsy = this.save.toNumber(materialInfo[2].fsy2);
      ElasticID = 's2';
    }
    if (fsy === null) {
      return new Array();
    }

    // 鉄筋径
    let dia: string = 'D' + barInfo.side_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.side_dia;
    }

    // 鉄筋情報を登録
    for (let i = 0; i < n; i++) {
      const Steel1 = {
        Depth: dse + i * space,
        i: dia,
        n: line,
        IsTensionBar: false,
        ElasticID: ElasticID,
        fsyk: fsy
      };
      result.push(Steel1);
    }
    // 印刷用の変数に登録
    printSideBar['As'] = this.save.getAs(dia) * n;
    printSideBar['AsString'] = dia + '-' + n + '段';
    printSideBar['ds'] = this.getBarCenterPosition(dse, n, 1, space, 1);

    return result;
  }

  // 鉄筋の重心位置を求める
  private getBarCenterPosition(cover: number, n: number, line: number, space: number, cos: number): number {
    // 計算する必要のない場合の処理
    if (cover === null) { return 0; }
    if (n === null || n <= 0) { return cover; }
    if (line === null || line <= 0) { return cover; }
    if (space === null || space <= 0) { return cover; }
    if (n < line) { return cover; }
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
    if (starrup.stirrup_dia === null) { return null; }
    if (starrup.stirrup_n === null) { return null; }
    if (starrup.stirrup_n === 0) { return null; }
    if (starrup.stirrup_ss === null) { return null; }
    if (starrup.stirrup_ss === 0) { return null; }

    const result = {
      'AW-φ': 0,
      Aw: 0,
      AwString: '',
      fwyd: 0,
      fwud: 0,
      deg: 90,
      Ss: 0
    };

    let fwyd: number;
    let fwud: number;
    if (starrup.stirrup_dia <= materialInfo[0].fsy1) {
      fwyd = this.save.toNumber(materialInfo[3].fsy1);
      fwud = this.save.toNumber(materialInfo[3].fsu1);
    } else {
      fwyd = this.save.toNumber(materialInfo[3].fsy2);
      fwud = this.save.toNumber(materialInfo[3].fsu2);
    }
    if (fwyd === null) { return null; }

    let dia: string = 'D' + starrup.stirrup_dia;
    if (fwyd === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + starrup.stirrup_dia;
    }
    const As: number = this.save.getAs(dia);
    const n: number = starrup.stirrup_n;
    result['AW-φ'] = starrup.stirrup_dia;
    result.Aw = As * n;
    result.AwString = dia + '-' + n + '本';
    result.Ss = starrup.stirrup_ss;
    result.fwyd = fwyd;
    result.fwud = fwud;

    return result;
  }

  // 鉄筋の入力情報を セット
  public setBarData(g_no: number, m_no: number, position: any): any {

    const temp = JSON.parse(
      JSON.stringify({
        temp: this.save.bars.getBarsColumns()
      })
    ).temp;
    
    const barList = temp.find(function (value) {
      return (value[0].g_no === g_no);
    });
    if (barList === undefined) {
      console.log('部材グループが存在しない');
      this.clearPostDataAll(position);
      return;
    }

    const startFlg: boolean[] = [false, false];
    let barData: object = null;
    for (let i = barList.length - 1; i >= 0; i--) {
      // 同じ部材番号を探す
      if (barList[i].positions.length < 1) { continue; }
      if (startFlg[0] === false) {
        if (barList[i].positions[0].m_no === m_no) {
          startFlg[0] = true;
        } else {
          continue;
        }
      }

      // 同じ着目点位置を探す
      for (let j = barList[i].positions.length - 1; j >= 0; j--) {
        const bar = barList[i].positions[j];
        if (startFlg[1] === false) {
          if (bar.index === position.index) {
            startFlg[1] = true;
          } else {
            continue;
          }
        }
        // 鉄筋情報を集計
        if (barData === null) {
          barData = bar;
        } else {
          this.setBarObjectValue(barData, bar);
        }
      }
    }

    position['barData'] = barData;
  }

  // 連想配列の null の要素をコピーする
  private setBarObjectValue(target: object, obj: object): void {
    try {
      for (const key of Object.keys(obj)) {
        if (obj[key] === undefined) { continue; }
        if (obj[key] === null) { continue; }
        if (key === 'haunch_M') { continue; }
        if (key === 'haunch_V') { continue; }
        if (key === 'tan') { continue; }
        if (key === 'b') { continue; }
        if (key === 'h') { continue; }
        if (key === 'm_no') { continue; }
        if (key === 'p_name') { continue; }
        if (key === 'p_name_ex') { continue; }
        if (key === 'position') { continue; }
        if (key === 'index') { continue; }
        if (key === 'title') { continue; }
        if (key === 'cos') { continue; }
        if (key === 'enable') { continue; }

        if (typeof obj[key] === 'object') {
          this.setBarObjectValue(target[key], obj[key]);
        } else {
          if (target[key] === null || target[key] === '') {
            target[key] = obj[key];
          }
        }
      }
    } catch {
      console.log('aa');
    }
  }

  // 角度をラジアンに変換
  public Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

  private clearPostDataAll(position: any): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key] = new Array();
      i++;
      key = 'PostData' + i.toString();
    }
  }
}
