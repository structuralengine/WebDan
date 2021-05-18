import { Injectable } from '@angular/core';
import { InputBarsService } from '../components/bars/bars.service';
import { InputBasicInformationService } from '../components/basic-information/basic-information.service';
import { InputSteelsService } from '../components/steels/steels.service';
import { DataHelperModule } from '../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetBarService {

  constructor(
    private bars: InputBarsService,
    private helper: DataHelperModule) {
  }

  // 鉄筋情報を集計する
  // member: 部材・断面情報
  // position: ハンチの情報
  // force: 荷重の情報
  // safety: 安全係数の情報
  public setPostData( member: any, force: any, safety: any, result: any): any {

    // const bar = this.bars.getCalcData(force.index);
    //

    // 鉄筋情報を 集計
    let bars: any;
    if (result.shape === 'Circle' || result.shape === 'Ring') {
      bars = this.getCircleBar(member, force.index, force.side, safety);

    } else if ( result.shape === 'Rectangle' ||
                result.shape === 'Tsection' ||
                result.shape === 'InvertedTsection') {
      bars = this.getRectBar(member, bar, force.side, safety);

    } else if (result.shape === 'HorizontalOval') {
      bars = this.getRectBar(member, bar, '横小判', safety);

    } else if (result.shape === 'VerticalOval') {
      bars = this.getVerticalOvalBar(member, bar, safety);

    } else {
      console.log("断面形状：" + result.shape + " は適切ではありません。");
      return null;
    }

    // POST 用の断面情報をセット
    for(const key of Object.keys(bars)){
      result[key] = bars[key];
    }

    return result;
  }


  // 横小判形における 側面鉄筋 の 鉄筋情報を生成する関数
  private getHorizontalOvalSideBar(
    barInfo: any,
    safety: any,
    tensionBar: any,
    compresBar: any,
    height: number): any[] {

    const materialInfo = safety.material_bar;

    const result: any[] = new Array();

    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(barInfo.side_dia) === null) {
      return new Array();
    }
    // 鉄筋段数
    const n = barInfo.sidebar_n;
    if (this.helper.toNumber(n) === null) {
      return new Array(); // 鉄筋段数の入力が ない場合は スキップ
    }
    if (n === 0) {
      return new Array(); // 鉄筋段数の入力が 0 の場合は スキップ
    }

    // 主鉄筋のかぶり
    let dst = this.helper.toNumber(tensionBar.rebar_cover);
    if (dst === null) {
      dst = 0;
    }
    let dsc = this.helper.toNumber(compresBar.rebar_cover);
    if (dsc === null) {
      dsc = dst;
    }

    // 鉄筋配置直径
    const Rt: number = height - (dst + dsc);

    // 鉄筋配置弧の長さ
    const arcLength: number = Rt * Math.PI / 2;

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

    // 鉄筋強度
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

      const dt = (Rt / 2) - (Math.cos(this.Radians(deg)) * Rt / 2) + dsc;

      const Steel1 = {
        Depth: dt,
        i: dia,
        n: line,
        IsTensionBar: false,
        ElasticID: ElasticID,
        fsyk: fsy
      };
      result.push(Steel1);

      Num += line;
      Dsn += dt * line;
    }

    // 印刷用の変数に登録
    result['As'] = this.helper.getAs(dia) * n;
    result['AsString'] = dia + '-' + n + '段';
    result['ds'] = Dsn / Num;

    return result;
  }

  // 縦小判形の 鉄筋のPOST用 データを登録する。
  public getVerticalOvalBar(member: any, bar: any, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
      PrintData: {}
    };

    const h: number = this.helper.toNumber(member.H);
    const b: number = this.helper.toNumber(member.B);

    const tensionBar: any = bar.rebar1;
    const compresBar: any = bar.rebar2;
    const sideBar = bar.sidebar;

    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(tensionBar.rebar_dia) === null) {
      return result;
    }
    if (this.helper.toNumber(compresBar.rebar_dia) === null) {
      compresBar.rebar_dia = tensionBar.rebar_dia;
    }

    // 鉄筋の本数の入力が ない場合は スキップ
    let rebar_n1 = this.helper.toNumber(tensionBar.rebar_n);
    if (rebar_n1 === null) {
      return result;
    }
    let rebar_n2 = this.helper.toNumber(compresBar.rebar_n);
    if (rebar_n2 === null) {
      rebar_n2 = rebar_n1;
    }

    // 1段当りの本数
    let line1: number = this.helper.toNumber(tensionBar.rebar_lines);
    if (line1 === null) {
      line1 = rebar_n1;
    }
    let line2: number = this.helper.toNumber(compresBar.rebar_lines);
    if (line2 === null) {
      line2 = rebar_n2;
    }

    // 鉄筋段数
    const n1: number = Math.ceil(line1 / rebar_n1);
    const n2: number = Math.ceil(line2 / rebar_n2);

    // 鉄筋アキ
    let space1: number = this.helper.toNumber(tensionBar.rebar_space);
    if (space1 === null) {
      space1 = 0;
    }
    let space2: number = this.helper.toNumber(compresBar.rebar_space);
    if (space2 === null) {
      space2 = 0;
    }
    // 鉄筋かぶり
    let dsc1 = this.helper.toNumber(tensionBar.rebar_cover);
    if (dsc1 === null) {
      dsc1 = 0;
    }
    let dsc2 = this.helper.toNumber(compresBar.rebar_cover);
    if (dsc2 === null) {
      dsc2 = 0;
    }

    // 鉄筋強度
    let fsy1: number;
    let fsu1: number;
    let ElasticID1: string;
    if (tensionBar.rebar_dia <= safety.material_bar[0].separate) {
      fsy1 = this.helper.toNumber(safety.material_bar[0].tensionBar.fsy);
      fsu1 = this.helper.toNumber(safety.material_bar[0].tensionBar.fsu);
      ElasticID1 = 's1';
    } else {
      fsy1 = this.helper.toNumber(safety.material_bar[1].tensionBar.fsy);
      fsu1 = this.helper.toNumber(safety.material_bar[1].tensionBar.fsu);
      ElasticID1 = 's2';
    }
    if (fsy1 === null) {
      return result;
    }
    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    result.SteelElastic.push({
      fsk: fsy1 / rs,
      Es: 200,
      ElasticID1
    });

    // 鉄筋径
    let dia1: string = 'D' + tensionBar.rebar_dia;
    if (fsy1 === 235) { // 鉄筋強度が 235 なら 丸鋼
      dia1 = 'R' + tensionBar.rebar_dia;
    }

    // 圧縮（上側）鉄筋配置
    const compresBarList: any[] = new Array();
    if (safety.safety_factor.range >= 2) {

      let fsy2: number;
      let ElasticID2: string;
      if (compresBar.rebar_dia <= safety.material_bar[0].separate) {
        fsy2 = this.helper.toNumber(safety.material_bar[0].tensionBar.fsy);
        ElasticID2 = 's1'
      } else {
        fsy2 = this.helper.toNumber(safety.material_bar[1].tensionBar.fsy);
        ElasticID2 = 's2'
      }
      if (fsy2 === null) {
        fsy2 = fsy1;
      }
      let dia2: string = 'D' + compresBar.rebar_dia;
      if (fsy2 === 235) { // 鉄筋強度が 235 なら 丸鋼
        dia2 = 'R' + compresBar.rebar_dia;
      }
      if(result.SteelElastic.find(
        e => e.ElasticID===ElasticID2) === undefined){
          result.SteelElastic.push({
            fsk: fsy2 / rs,
            Es: 200,
            ElasticID2
          });
      }

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

      result['Asc'] = this.helper.getAs(dia2) * rebar_n2;
      result['AscString'] = dia2 + '-' + rebar_n2 + '本';
      result['dsc'] = this.getBarCenterPosition(dsc2, rebar_n2, line2, space2, 1);
    }

    // 側方鉄筋 をセットする
    let sideBarList: any[] = new Array();
    if (safety.safety_factor.range >= 3) {
      const rebar = this.getSideBar(sideBar, safety, '', h - b, 0, 0);
      sideBarList = rebar.Steels;
      for(const elastic of rebar.SteelElastic){
        result.SteelElastic.push(elastic);
      }

      // 印刷用の変数に登録
      result['Ase'] = rebar['As'];
      result['AseString'] = rebar['AsString'];
      result['dse'] = rebar['ds'];
    }

    // 引張（下側）鉄筋配置
    const tensionBarList: any[] = new Array();

    let nAs: number = 0;
    let nDepth: number = 0;
    const As: number = this.helper.getAs(dia1);

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
    result['Ast-n'] = n1; // ひび割れの検討k3 に用いる鉄筋段数
    result['Ast-c'] = dsc1 - (tensionBar.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-φ'] = tensionBar.rebar_dia; // ひび割れの検討 に用いる鉄筋径

    let Cs: number = this.helper.toNumber(tensionBar.rebar_ss);
    if (Cs === null) {
      Cs = (h - (dsc1 * 2)) * Math.PI / line1;
    }
    result['Ast-Cs'] = Cs; // ひび割れの検討 に用いる鉄筋間隔
    result['Vyd_d'] = nDepth / nAs;
    result['Vyd_Ast'] = nAs;

    // 印刷用の変数に登録
    result['fsu'] = fsu1;
    result['fsy'] = fsy1;
    result['rs'] = rs;
    result['Es'] = 200;

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
    result['Ast'] = this.helper.getAs(dia1) * rebar_n1;
    result['AstString'] = dia1 + '-' + rebar_n1 + '本';
    result['dst'] = this.getBarCenterPosition(dsc1, rebar_n1, line1, space1, 1);
    result['Ast-c'] = dsc1 - (tensionBar.rebar_dia/2); // ひび割れの検討 に用いる1段目の鉄筋かぶり
    result['Ast-Cs'] = tensionBar.rebar_ss; // ひび割れの検討 に用いる鉄筋間隔
    result['Ast-φ'] = tensionBar.rebar_dia; // ひび割れの検討 に用いる鉄筋径

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
    return result;
  }

  // 円形の 鉄筋のPOST用 データを登録する。
  public getCircleBar(member: any, index: number, side: string, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };
    const barInfo = this.getAs('Circle', index, side);
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
    // 鉄筋強度
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

    // 鉄筋径
    let dia: string = 'D' + barInfo.rebar_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.rebar_dia;
    }

    // 鉄筋配置
    let h: number = this.helper.toNumber(member.H);
    if (h === null) {
      h = this.helper.toNumber(member.B);
    }
    if (h === null) { return result; }

    let nAs: number = 0;
    let nDepth: number = 0;
    const As: number = this.helper.getAs(dia);

    for (let i = 0; i < barInfo.n; i++) {

      const Depth =barInfo. dsc + i * barInfo.space;
      const Rt: number = h - (Depth * 2);   // 鉄筋直径
      const num = barInfo.rebar_n - barInfo.line * i;       // 鉄筋本数
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
    const rs = safety.safety_factor.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsy / rs,
      Es: 200,
      ElasticID: 's'
    });


    // 印刷用の変数に登録
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
    return result;
  }

  // 矩形 T形の 鉄筋のPOST用 データを登録する。
  public getRectBar(member: any, bar: any, side: string, safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };

    const height: number = member.H;
    let tension: any;
    let compres: any;

    switch (side) {
      case '上側引張':
        tension = bar.rebar1;
        compres = bar.rebar2;
        break;
      case '下側引張':
        tension = bar.rebar2;
        compres = bar.rebar1;
        break;
      case '横小判':
        tension = bar.rebar1;
        compres = bar.rebar2;
        break;
    }

    // 基準となる 鉄筋強度
    const rs = safety.safety_factor.rs;

    const tensionBar = this.getCompresBar(tension, safety);
    const tensionBarList = tensionBar.Steels
    // 有効な入力がなかった場合は null を返す.
    if (tensionBarList.length < 1) {
      return null;
    }
    // 鉄筋強度の入力
    for(const elastic of tensionBar.SteelElastic){
      result.SteelElastic.push(elastic);
    }

    // 圧縮鉄筋 をセットする
    let compresBarList: any[] = new Array();
    if (safety.safety_factor.range >= 2) {
      const compresBar = this.getCompresBar(compres, safety);
      compresBarList = compresBar.Steels;
      // 鉄筋強度の入力
      for(const elastic of compresBar.SteelElastic){
        // 引張鉄筋ですでに同名の鉄筋が登録されていなかったら登録する
        if(result.SteelElastic.find(
          e => e.ElasticID===elastic.ElasticID) === undefined){
          result.SteelElastic.push(elastic);
        }
      }
      result['Asc'] = compresBar['As'];
      result['AscString'] = compresBar['AsString'];
      result['AscCos'] = compresBar['cos'];
      result['dsc'] = compresBar['ds'];
    }

    // 側方鉄筋 をセットする
    let sideBar: any;
    let sideBarList = new Array();
    if (safety.safety_factor.range >= 3) {

      if (side === '横小判') {
        sideBar = this.getHorizontalOvalSideBar(
          bar.sidebar, safety,
          tension, compres, height);

      } else {
        const tensionBarDepth = tensionBarList[tensionBarList.length - 1].Depth;
        const compresBarDepth = (compresBarList.length > 0) ?
          compresBarList[compresBarList.length - 1].Depth : 0;
        sideBar = this.getSideBar(
          bar.sidebar, safety, side,
          height, tensionBarDepth, compresBarDepth);

      }
      sideBarList = sideBar.Steels;
      // 鉄筋強度の入力
      for(const elastic of sideBar.SteelElastic){
        result.SteelElastic.push(elastic);
      }
    }

    // 圧縮鉄筋の登録
    let cosAsc: number = this.helper.toNumber(compres.cos);
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
    let cosAst: number = this.helper.toNumber(tension.cos);
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

    return result;
  }

  // 矩形。Ｔ形断面における 上側（圧縮側）の 鉄筋情報を生成する関数
  private getCompresBar(barInfo: any,
                        safety: any): any {
    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };

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
    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    result.SteelElastic.push({
      fsk: fsy / rs,
      Es: 200,
      ElasticID
    });


    // 鉄筋径
    let dia: string = 'D' + barInfo.rebar_dia;
    if (fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + barInfo.rebar_dia;
    }

    // cos に入力があれば本数に反映。鉄筋の本数の入力が ない場合は スキップ
    let cos = this.helper.toNumber(barInfo.cos);
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
        ElasticID: ElasticID
      };
      result.Steels.push(Steel1);
      rebar_n = rebar_n - line;
    }

    // 印刷用の変数に登録
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

    return result;
  }

  // 矩形。Ｔ形断面における 側面鉄筋 の 鉄筋情報を生成する関数
  private getSideBar( barInfo: any, safety: any,
                      side: string, height: number,
                      dst: number, dsc: number): any {


    const result = {
      Steels: new Array(),
      SteelElastic: new Array()
    };

    // 鉄筋径の入力が ない場合は スキップ
    if (this.helper.toNumber(barInfo.side_dia) === null) {
      return result;
    }
    // 鉄筋段数
    const n = barInfo.side_n;
    if (this.helper.toNumber(n) === null) {
      return result; // 鉄筋段数の入力が ない場合は スキップ
    }
    if (n === 0) {
      return result; // 鉄筋段数の入力が 0 の場合は スキップ
    }

    const materialInfo = safety.material_bar;

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

    // 鉄筋強度
    let fsy: number;
    let ElasticID: string;
    if (barInfo.side_dia < materialInfo[0].separate) {
      fsy = this.helper.toNumber(materialInfo[0].sidebar.fsy);
      ElasticID = 's1';
    } else {
      fsy = this.helper.toNumber(materialInfo[1].sidebar.fsy);
      ElasticID = 's2';
    }
    if (fsy === null) {
      return result;
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
      result.Steels.push(Steel1);
    }

    // 鉄筋強度の入力
    const rs = safety.safety_factor.rs;

    result.SteelElastic.push({
      fsk: fsy / rs,
      Es: 200,
      ElasticID
    });

    // 印刷用の変数に登録
    result['As'] = this.helper.getAs(dia) * n;
    result['AsString'] = dia + '-' + n + '段';
    result['ds'] = this.getBarCenterPosition(dse, n, 1, space, 1);

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
    if (starrup.stirrup_dia <= materialInfo[0].separate) {
      fwyd = this.helper.toNumber(materialInfo[0].stirrup.fsy);
      fwud = this.helper.toNumber(materialInfo[0].stirrup.fsu);
    } else {
      fwyd = this.helper.toNumber(materialInfo[1].stirrup.fsy);
      fwud = this.helper.toNumber(materialInfo[1].stirrup.fsu);
    }
    if (fwyd === null) { return null; }

    let dia: string = 'D' + starrup.stirrup_dia;
    if (fwyd === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      dia = 'R' + starrup.stirrup_dia;
    }
    const As: number = this.helper.getAs(dia);
    const n: number = starrup.stirrup_n;
    result['AW-φ'] = starrup.stirrup_dia;
    result.Aw = As * n;
    result.AwString = dia + '-' + n + '本';
    result.Ss = starrup.stirrup_ss;
    result.fwyd = fwyd;
    result.fwud = fwud;

    return result;
  }

  // 角度をラジアンに変換
  public Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

  // 鉄筋量の情報を返す
  public getAs(shapeName: string, index: number, side: string): any {
    
    let result = {};

    const bar = this.bars.getCalcData(index);

    switch(shapeName){
      case 'Circle':            // 円形
        const barInfo: any = bar.rebar1;
        if (this.helper.toNumber(barInfo.rebar_dia) === null) {
          return null;
        }
        let rebar_n = this.helper.toNumber(barInfo.rebar_n);
        if (rebar_n === null) {
          return null;
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
        result ={ rebar_dia: barInfo.rebar_dia, rebar_n, line, n, space, dsc };
        break;

      case 'Ring':              // 円環
        break;

      case 'Rectangle':         // 矩形
        break;

      case 'Tsection':          // T形
      case 'InvertedTsection':  // 逆T形
        break;

      case 'HorizontalOval':    // 水平方向小判形
      case 'VerticalOval':      // 鉛直方向小判形
        break;

      default:
        console.log("断面形状：" + shapeName + " は適切ではありません。");
        return null;
    }    
    return result;
  }

  // せん断補強鉄筋量の情報を返す
  public getAw(shapeName: string, index: number, side: string): any {
    
    let result = {};
    return result;
  }

  // 鉄筋強度の情報を返す
  public getFsy(rebar_dia: number, material_bar: any, side: string): any {
    
    let result = {
      fsy: null,
      fsu: null
    };

    if (rebar_dia <= material_bar[0].separate) {
      result.fsy = this.helper.toNumber(material_bar[0].tensionBar.fsy);
      result.fsu = this.helper.toNumber(material_bar[0].tensionBar.fsu);
    } else {
      result.fsy = this.helper.toNumber(material_bar[1].tensionBar.fsy);
      result.fsu = this.helper.toNumber(material_bar[1].tensionBar.fsu);
    }

    return result;
  }


}
