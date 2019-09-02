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
    if (barInfo.side_dia < materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[2].fsy1);
    } else {
      fsy = this.save.toNumber(materialInfo[2].fsy2);
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
        ElasticID: 's',
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
      SteelElastic: new Array()
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
    if (tensionBar.rebar_dia <= position.materialInfo[0].fsy1) {
      fsy1 = this.save.toNumber(position.materialInfo[1].fsy1);
    } else {
      fsy1 = this.save.toNumber(position.materialInfo[1].fsy2);
    }
    if (fsy1 === null) {
      return result;
    }
    let fsy2: number;
    if (compresBar.rebar_dia <= position.materialInfo[0].fsy1) {
      fsy2 = this.save.toNumber(position.materialInfo[1].fsy1);
    } else {
      fsy2 = this.save.toNumber(position.materialInfo[1].fsy2);
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
            ElasticID: 's'            // 材料番号
          };
          compresBarList.push(Steel1);
        }
      }
      result['ptint-Asc'] = this.save.getAs(dia2) * rebar_n2;
      result['print-AscString'] = dia2 + '-' + rebar_n2 + '本';
      result['print-dsc'] = this.getBarCenterPosition(dsc2, rebar_n2, line2, space2);
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    const printSideBar = {};
    if (position.safety_factor.range >= 3) {
      sideBarList = this.getSideBar(sideBar, position.material_steel, '', h - b, printSideBar);
      // 印刷用の変数に登録
      result['ptint-Ase'] = printSideBar['As'];
      result['print-AseString'] = printSideBar['AsString'];
      result['print-dse'] = printSideBar['ds'];
    }

    // 引張（下側）鉄筋配置
    let tensionBarList: any[] = new Array();
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
          ElasticID: 's'            // 材料番号
        };
        tensionBarList.push(Steel1);
      }
    }

    // 鉄筋強度の入力
    const rs = position.safety_factor.rs;
    result.SteelElastic.push({
      fsk: fsy1 / rs,
      Es: 200,
      ElasticID: 's'
    });
    // 印刷用の変数に登録
    result['print-fsy'] = fsy1;
    result['print-rs'] = rs;
    result['print-Es'] = 200;

    // 圧縮鉄筋の登録
    for (const Asc of compresBarList) {
      Asc.n = Asc.n * fsy2 / fsy1;
      result.Steels.push(Asc);
    }

    // 側面鉄筋の登録
    for (const Ase of sideBarList) {
      Ase.Depth = Ase.Depth + b / 2;
      Ase.n = Ase.n * Ase.fsyk / fsy1;
      result.Steels.push(Ase);
    }

    // 引張鉄筋の登録
    for (const Ast of tensionBarList) {
      result.Steels.push(Ast);
    }
    // 印刷用の変数に登録
    result['ptint-Ast'] = this.save.getAs(dia1) * rebar_n1;
    result['print-AstString'] = dia1 + '-' + rebar_n1 + '本';
    result['print-dst'] = this.getBarCenterPosition(dsc1, rebar_n1, line1, space1);

    return result;
  }



  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  public getCircleBar(position: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
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
    if (barInfo.rebar_dia <= position.materialInfo[0].fsy1) {
      fsy = this.save.toNumber(position.materialInfo[1].fsy1);
    } else {
      fsy = this.save.toNumber(position.materialInfo[1].fsy2);
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
    const h: number = position.memberInfo.H;
    for (let i = 0; i < n; i++) {

      const Depth = dsc + i * space;
      const Rt: number = h - (Depth * 2);   // 鉄筋直径
      const steps: number = 360 / (rebar_n - line * i); // 鉄筋角度間隔

      for (let deg = 0; deg <= 360; deg += steps) {
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
      }
    }
    // 印刷用の変数に登録
    result['ptint-Ast'] = this.save.getAs(dia) * rebar_n;
    result['print-AstString'] = dia + '-' + rebar_n + '本';
    result['print-dst'] = this.getBarCenterPosition(dsc, rebar_n, line, space);

    // 基準となる 鉄筋強度
    const rs = position.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsy / rs,
      Es: 200,
      ElasticID: 's'
    });
    // 印刷用の変数に登録
    result['print-fsy'] = fsy;
    result['print-rs'] = rs;
    result['print-Es'] = 200;

    return result;
  }

  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  public getRectBar(position: any, side: string, height: number): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
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

    const printTensionBar = {};
    const tensionBarList: any[] = this.getCompresBar(tensionBar, position.material_steel, printTensionBar);
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }

    // 圧縮鉄筋 をセットする
    let compresBarList: any[] = new Array();
    const printCompresBar = {};
    if (position.safety_factor.range >= 2) {
      compresBarList = this.getCompresBar(compresBar, position.material_steel, printCompresBar);
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    const printSideBar = {};
    if (position.safety_factor.range >= 3) {
      if (side === '横小判') {
        sideBarList = this.getHorizontalOvalSideBar(sideBar, position.material_steel, tensionBar, compresBar, height, printSideBar);
      } else {
        sideBarList = this.getSideBar(sideBar, position.material_steel, side, height, printSideBar);
      }
    }

    // 基準となる 鉄筋強度
    const fsyk = tensionBarList[0].fsyk;
    const rs = position.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsyk / rs,
      Es: 200,
      ElasticID: 's'
    });
    // 印刷用の変数に登録
    result['print-fsy'] = fsyk;
    result['print-rs'] = rs;
    result['print-Es'] = 200;

    // 圧縮鉄筋の登録
    for (const Asc of compresBarList) {
      Asc.n = Asc.n * Asc.fsyk / fsyk;
      result.Steels.push(Asc);
    }
    if (compresBarList.length > 0) { // 印刷用の変数に登録
      result['ptint-Asc'] = printCompresBar['As'];
      result['print-AscString'] = printCompresBar['AsString'];
      result['print-dsc'] = printCompresBar['ds'];
    }

    // 側面鉄筋の登録
    for (const Ase of sideBarList) {
      Ase.n = Ase.n * Ase.fsyk / fsyk;
      result.Steels.push(Ase);
    }
    if (sideBarList.length > 0) { // 印刷用の変数に登録
      result['ptint-Ase'] = printSideBar['As'];
      result['print-AseString'] = printSideBar['AsString'];
      result['print-dse'] = printSideBar['ds'];
    }

    // 引張鉄筋の登録
    for (const Ast of tensionBarList) {
      Ast.Depth = height - Ast.Depth;
      Ast.IsTensionBar = true;
      result.Steels.push(Ast);
    }
    // 印刷用の変数に登録
    result['ptint-Ast'] = printTensionBar['As'];
    result['print-AstString'] = printTensionBar['AsString'];
    result['print-dst'] = printTensionBar['ds'];

    return result;
  }

  // 矩形。Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any, materialInfo: any[],
    printTensionBar: any): any[] {

    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.save.toNumber(barInfo.rebar_dia) === null) {
      return new Array();
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n = this.save.toNumber(barInfo.rebar_n);
    if (rebar_n === null) {
      return new Array();
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
    if (barInfo.rebar_dia <= materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[1].fsy1);
    } else {
      fsy = this.save.toNumber(materialInfo[1].fsy2);
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

    // 鉄筋情報を登録
    for (let i = 0; i < n; i++) {
      const Steel1 = {
        Depth: dsc + i * space,
        i: dia,
        n: Math.min(line, rebar_n),
        IsTensionBar: false,
        ElasticID: 's',
        fsyk: fsy
      };
      result.push(Steel1);
      rebar_n = rebar_n - line;
    }
    // 印刷用の変数に登録
    printTensionBar['As'] = this.save.getAs(dia) * barInfo.rebar_n;
    printTensionBar['AsString'] = dia + '-' + barInfo.rebar_n + '本';
    printTensionBar['ds'] = this.getBarCenterPosition(dsc, barInfo.rebar_n, line, space);

    return result;
  }

  // 矩形。Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar(barInfo: any, materialInfo: any[],
    side: string, height: number,
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

    // 鉄筋間隔
    let space = barInfo.side_ss;
    if (this.save.toNumber(space) === null) {
      space = height / (n + 1);
    }

    // 鉄筋かぶり
    let dse = barInfo.side_cover;
    if (this.save.toNumber(dse) === null) {
      dse = space;
    }
    if (side === '上側引張') {
      dse = height - dse;
    }

    // 1段当りの本数
    const line = 2;

    // 鉄筋強度
    let fsy: number;
    if (barInfo.side_dia < materialInfo[0].fsy1) {
      fsy = this.save.toNumber(materialInfo[2].fsy1);
    } else {
      fsy = this.save.toNumber(materialInfo[2].fsy2);
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
        ElasticID: 's',
        fsyk: fsy
      };
      result.push(Steel1)
    }
    // 印刷用の変数に登録
    printSideBar['As'] = this.save.getAs(dia) * n;
    printSideBar['AsString'] = dia + '-' + n + '段';
    printSideBar['ds'] = this.getBarCenterPosition(dse, n, 1, space);

    return result;
  }

  // 鉄筋の重心位置を求める
  private getBarCenterPosition(cover: number, n: number, line: number, space: number): number {
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
    const result: number = PosNum / n;
    return result;
  }

  // 鉄筋の入力情報を セット
  public setBarData(g_no: number, m_no: number, position: any): any {

    const temp = this.save.bars.getBarsColumns();
    const barList = temp.find(function (value) {
      return (value[0].g_no === g_no);
    });
    if (barList === undefined) {
      console.log('部材グループが存在しない')
      position.PostData = new Array();
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
          if (target[key] === null) {
            target[key] = obj[key];
          }
        }
      }
    } catch {
      console.log('aa');
    }
  }

  // 角度をラジアンに変換
  private Radians(degree: number) {
    return degree * (Math.PI / 180);
  }
}
