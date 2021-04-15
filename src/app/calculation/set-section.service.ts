import { Injectable } from '@angular/core';
import { DataHelperModule } from '../providers/data-helper.module';
import { SaveDataService } from '../providers/save-data.service';
import { SetBarService } from './set-bar.service';

@Injectable({
  providedIn: 'root'
})
export class SetSectionService {

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule,
    private bar: SetBarService) {
  }

  // position に コンクリート・鉄筋情報を入力する /////////////////////////////////////////////////////////////////////
  public setPostData(g_id: string, m_no: number, position: any): void {

    // 部材・断面情報
    const memberInfo = position.memberInfo;

    // 出力用の変数の用意する
    position['PrintData'] = JSON.parse(
      JSON.stringify({
        temp: position.PostData0
      })
    ).temp;

    // 鉄筋の入力情報ををセット
    this.bar.setBarData(g_id, m_no, position);

    //barがnullなら処理を飛ばす
    if (position.barData === null) {
      this.clearPostDataAll(position);
      return;
    }

    // POST 用の断面情報をセット
    if (memberInfo.shape.indexOf('円') >= 0) {

      // 円形の場合は 上側引張、下側引張　どちらかにする
      if (position.PostData0.length > 1) {
        if (Math.abs(position.PostData0[0]) > Math.abs(position.PostData0[1])) {
          // 末尾の要素を取り除く
          let i = 0;
          while ('PostData' + i.toString() in position) {
            position['PostData' + i.toString()].pop();
            i++;
          }
          position.PrintData.pop();
        } else {
          // 先頭の要素を取り除く
          let i = 0;
          while ('PostData' + i.toString() in position) {
            position['PostData' + i.toString()].shift();
            i++;
          }
          position.PrintData.shift();
        }
      }
      let isEnable: boolean;
      if (memberInfo.shape.indexOf('円形') >= 0) {
        isEnable = this.getCircle(position);
      } else if (memberInfo.shape.indexOf('円環') >= 0) {
        isEnable = this.getRing(position);
      } else {
        isEnable = false;
      }
      if (isEnable === false) {
        let i = 0;
        while ('PostData' + i.toString() in position) {
          position['PostData' + i.toString()] = new Array();
          i++;
        }
        return;
      }

    } else if (memberInfo.shape.indexOf('矩形') >= 0) {

      for (let i = position.PostData0.length - 1; i >= 0; i--) {
        if (this.getRectangle(position, i) === false) {
          this.splicePostDataAll(position, i);
        }
      }

    } else if (memberInfo.shape.indexOf('T') >= 0) {

      // Ｔ形に関する 設計条件を確認する
      let condition = this.save.basic.conditions_list.find((value) => {
        return (value.id === 'JR-002');
      });
      if (condition === undefined) {
        condition = { id: 'undefined', selected: false };
      }

      for (let i = position.PostData0.length - 1; i >= 0; i--) {
        let isEnable: boolean;
        if (memberInfo.shape.indexOf('T形') >= 0) {
          if (condition.selected === true && position.PostData0[i].memo === '上側引張') {
            // T形 断面の上側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getTsection(position, i);
          }
        } else if (memberInfo.shape.indexOf('逆T形') >= 0) {
          if (condition.selected === true && position.PostData0[i].memo === '下側引張') {
            // 逆T形 断面の下側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getInvertedTsection(position, i);
          }
        } else {
          isEnable = false;
        }
        if (isEnable === false) {
          this.splicePostDataAll(position, i)
        }

      }

    } else if (memberInfo.shape.indexOf('小判形') >= 0) {

      // 小判形の場合は 上側引張、下側引張　どちらかにする
      if (position.PostData0.length > 1) {
        if (Math.abs(position.PostData0[0]) > Math.abs(position.PostData0[1])) {
          // 末尾の要素を取り除く
          this.popPostDataAll(position);
          position.PrintData.pop();
        } else {
          // 先頭の要素を取り除く
          this.shiftPostDataAll(position);
          position.PrintData.shift();
        }
      }
      let isEnable: boolean;
      if (memberInfo.B > memberInfo.H) {
        isEnable = this.getHorizontalOval(position);
      } else if (memberInfo.B < memberInfo.H) {
        isEnable = this.getVerticalOval(position);
      } else if (memberInfo.B === memberInfo.H) {
        isEnable = this.getCircle(position);
      }
      if (isEnable === false) {
        this.clearPostDataAll(position);
        return;
      }

    } else {
      console.log("断面形状：" + memberInfo.shape + " は適切ではありません。");
      this.clearPostDataAll(position);
      return;
    }

  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOval(position: any): boolean {
    const PostData = position.PostData0[0];
    const PrintData = position.PrintData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return false; }

    const steps = 180 / RCOUNT;

    let olddeg = 0;
    for (let deg = steps; deg <= 180; deg += steps) {
      const section = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * h / 2, // 断面高さ
        WTop: b - h + Math.sin(this.Radians(olddeg)) * h, // 断面幅（上辺）
        WBottom: b - h + Math.sin(this.Radians(deg)) * h, // 断面幅（底辺
        ElasticID: 'c'                                    // 材料番号
      };
      PostData.Sections.push(section);
      olddeg = deg;
    }

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, '横小判', h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'HorizontalOval'; // 形状
    PrintData['B'] = b; // 断面幅
    PrintData['H'] = h; // 断面高さ

    // せん断照査用の換算矩形断面を算定
    const circleArea: number = (h ** 2) * Math.PI / 4;
    const rectArea: number = h * (b - h);
    const Area = circleArea + rectArea;
    PrintData['Vyd_H'] = h;
    PrintData['Vyd_B'] = Area / h;
    PrintData['Vyd_pc'] = PrintData.Ast / (PrintData.Vyd_B * PrintData.Vyd_d);

    // 断面積と断面係数
    PrintData['A'] = Area;
    PrintData['I'] = (Math.pow(h, 4) * Math.PI / 64) + ((b - h) * Math.pow(h, 3) / 12);
    PrintData['eu'] = h / 2;
    PrintData['el'] = h / 2;

    return true;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOval(position: any): boolean {
    const PostData = position.PostData0[0];
    const PrintData = position.PrintData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return false; }

    const steps = 180 / RCOUNT;

    let olddeg = 0;
    // 上側の曲線部
    for (let deg = steps; deg <= 90; deg += steps) {
      const section1 = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.Radians(olddeg)) * b,   // 断面幅（上辺）
        WBottom: Math.sin(this.Radians(deg)) * b,   // 断面幅（底辺
        ElasticID: 'c'                        // 材料番号
      };
      PostData.Sections.push(section1);
      olddeg = deg;
    }

    // 直線部
    const section2 = {
      Height: h - b,    // 断面高さ
      WTop: b,          // 断面幅（上辺）
      WBottom: b,       // 断面幅（底辺
      ElasticID: 'c'    // 材料番号
    };
    PostData.Sections.push(section2);

    // 下側の曲線部
    for (let deg = 90 + steps; deg <= 180; deg += steps) {
      const section3 = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.Radians(olddeg)) * b, // 断面幅（上辺）
        WBottom: Math.sin(this.Radians(deg)) * b, // 断面幅（底辺
        ElasticID: 'c'                            // 材料番号
      };
      PostData.Sections.push(section3);
      olddeg = deg;
    }

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getVerticalOvalBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'VerticalOval'; // 形状

    PrintData['B'] = b;
    PrintData['H'] = h;

    // せん断照査用の換算矩形断面を算定
    const x = h - b;
    const circleArea: number = (b ** 2) * Math.PI / 4;
    const rectArea: number = b * x;
    const Area = circleArea + rectArea;
    const Vyd_H = Area / b;
    const deltaH = h - Vyd_H;
    PrintData.Vyd_d -= deltaH / 2;
    PrintData['Vyd_H'] = Vyd_H;
    PrintData['Vyd_B'] = b;
    PrintData['Vyd_pc'] = PrintData.Ast / Area;

    // 断面積と断面係数
    PrintData['A'] = Area;
    const a1: number = Math.PI * Math.pow(b, 4) / 64;
    const a2: number = x * Math.pow(b, 3) / 6;
    const a3: number = Math.PI * Math.pow(x, 2) * Math.pow(b, 2) / 16;
    const a4: number = b * Math.pow(x, 3) / 12;
    PrintData['I'] = a1 + a2 + a3 + a4;
    PrintData['eu'] = h / 2;
    PrintData['el'] = h / 2;

    return true;
  }

  // T形断面の POST 用 データ作成
  private getInvertedTsection(position: any, index: number): boolean {
    const PostData = position.PostData0[index];
    const PrintData = position.PrintData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.helper.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.helper.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.helper.toNumber(position.memberInfo.t);
    if (bf === null && hf == null) {
      return this.getRectangle(position, index);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    PostData.Sections.push(section2);

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    PostData.Sections.push(section1);

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'InvertedTsection'; // 形状
    PrintData['B'] = b;
    PrintData['H'] = h;
    PrintData['Bt'] = bf;
    PrintData['t'] = hf;

    // せん断照査用の換算矩形断面を算定
    PrintData['Vyd_H'] = h;
    PrintData['Vyd_B'] = b;
    PrintData['Vyd_pc'] = PrintData.Ast / (b * PrintData.Vyd_d);

    // 断面積と断面係数
    const x: number = bf - b;
    PrintData['A'] = h * b + hf * x;
    const a1: number = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
    const a2: number = 2 * (b * h + x * hf);
    const e1: number = a1 / a2;
    const e2: number = h - e1;
    PrintData['eu'] = e2;
    PrintData['el'] = e1;
    const a3: number = bf * Math.pow(e1, 3);
    const a4: number = x * h;
    const a5: number = b * Math.pow(e2, 3);
    PrintData['I'] = (a3 - a4 + a5) / 3;

    return true;
  }

  // T形断面の POST 用 データ作成
  private getTsection(position: any, index: number): boolean {
    const PostData = position.PostData0[index];
    const PrintData = position.PrintData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.helper.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.helper.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.helper.toNumber(position.memberInfo.t);
    if (bf === null && hf == null) {
      return this.getRectangle(position, index);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

    const section1 = {
      Height: hf,
      WTop: bf,
      WBottom: bf,
      ElasticID: 'c'
    };
    PostData.Sections.push(section1);

    const section2 = {
      Height: h - hf,
      WTop: b,
      WBottom: b,
      ElasticID: 'c'
    };
    PostData.Sections.push(section2);

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'Tsection'; // 形状
    PrintData['B'] = b;
    PrintData['H'] = h;
    PrintData['Bt'] = bf;
    PrintData['t'] = hf;

    // せん断照査用の換算矩形断面を算定
    PrintData['Vyd_H'] = h;
    PrintData['Vyd_B'] = b;
    PrintData['Vyd_pc'] = PrintData.Ast / (b * PrintData.Vyd_d);

    // 断面積と断面係数
    const x: number = bf - b;
    PrintData['A'] = h * b + hf * x;
    const a1: number = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
    const a2: number = 2 * (b * h + x * hf);
    const e1: number = a1 / a2;
    const e2: number = h - e1;
    PrintData['eu'] = e1;
    PrintData['el'] = e2;
    const a3: number = bf * Math.pow(e1, 3);
    const a4: number = x * h;
    const a5: number = b * Math.pow(e2, 3);
    PrintData['I'] = (a3 - a4 + a5) / 3;

    return true;
  }

  // 矩形断面の POST 用 データ作成
  private getRectangle(position: any, index: number): boolean {
    const PostData = position.PostData0[index];
    const PrintData = position.PrintData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.helper.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M * 1;
    }
    const b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return false; }

    const section = {
      Height: h, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    PostData.Sections.push(section);

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'Rectangle'; // 形状
    PrintData['B'] = b;
    PrintData['H'] = h;

    // せん断照査用の換算矩形断面を算定
    PrintData['Vyd_H'] = h;
    PrintData['Vyd_B'] = b;
    PrintData['Vyd_pc'] = PrintData.Ast / (b * PrintData.Vyd_d);

    // 断面積と断面係数
    PrintData['A'] = b * h;
    PrintData['I'] = b * Math.pow(h, 3) / 12;
    PrintData['eu'] = h / 2;
    PrintData['el'] = h / 2;

    return true;
  }

  // 円環断面の POST 用 データ作成
  private getRing(position: any): boolean {
    const PostData = position.PostData0[0];
    const PrintData = position.PrintData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.helper.toNumber(position.memberInfo.B);
    if (b === null) { return this.getCircle(position); }
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
      PostData.Sections.push(section);
      b1 = b2;
      b3 = b4;
    }

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getCircleBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録  
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'Ring';  // 形状
    PrintData['R'] = h;           // 外径
    PrintData['r'] = b;           // 内径

    // せん断照査用の換算矩形断面を算定
    let Area = Math.pow(h, 2) * Math.PI / 4;
    const Vyd_H = Math.sqrt(Area);
    const deltaH = h - Vyd_H;
    PrintData.Vyd_d -= deltaH / 2;
    PrintData['Vyd_H'] = Vyd_H;
    Area -= (b ** 2) * Math.PI / 4;
    PrintData['Vyd_B'] = h - Math.sqrt((h ** 2) - Area);
    PrintData['Vyd_pc'] = PrintData.Vyd_Ast / (PrintData.Vyd_d * PrintData.Vyd_B);

    // 断面積と断面係数
    PrintData['A'] = (Math.pow(h, 2) - Math.pow(b, 2)) * Math.PI / 4;
    PrintData['I'] = (Math.pow(h, 4) - Math.pow(b, 4)) * Math.PI / 64;
    PrintData['eu'] = h / 2;
    PrintData['el'] = h / 2;

    return true;
  }

  // 円形断面の POST 用 データ作成
  private getCircle(position: any): boolean {
    const PostData = position.PostData0[0];
    const PrintData = position.PrintData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.helper.toNumber(position.memberInfo.H);
    if (h === null) { 
      h = this.helper.toNumber(position.memberInfo.B);
    }
    if (h === null) { return false; }
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
      PostData.Sections.push(section);
      b1 = b2;
    }

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getCircleBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
    } else {
      return false;
    }

    // 照査表印字のための変数 print に値を登録  
    for (const key of Object.keys(bars.PrintData)) {
      PrintData[key] = bars.PrintData[key];
    }

    PrintData['shape'] = 'Circle'; // 形状
    PrintData['R'] = h;

    // せん断照査用の換算矩形断面を算定
    const Area = Math.pow(h, 2) * Math.PI / 4;
    const Vyd_H = Math.sqrt(Area);
    const deltaH = h - Vyd_H;
    PrintData.Vyd_d -= deltaH / 2;
    PrintData['Vyd_H'] = Vyd_H;
    PrintData['Vyd_B'] = Vyd_H;
    PrintData['Vyd_pc'] = PrintData.Vyd_Ast / (PrintData.Vyd_d * PrintData.Vyd_B);

    // 断面積と断面係数
    PrintData['A'] = Math.pow(h, 2) * Math.PI / 4;
    PrintData['I'] = Math.pow(h, 4) * Math.PI / 64;
    PrintData['eu'] = h / 2;
    PrintData['el'] = h / 2;

    return true;
  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2));

    return Math.abs(2 * c);

  }


  // コンクリート強度の POST用データを返す
  private setSectionElastic(position: any): any[] {
    const result = new Array();
    const fck = position.material_concrete.fck;
    const rc = position.safety_factor.rc;
    const rfck = position.pile_factor.rfck;
    const rEc = position.pile_factor.rEc;
    const Ec = this.getEc(fck);
    const elastic = {
      fck: rfck * fck / rc,     // コンクリート強度
      Ec: rEc * Ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    result.push(elastic);

    // 照査表印字のための変数 print に値を登録
    for (const PrintData of position.PrintData) {
      PrintData['fck'] = fck;
      PrintData['rc'] = rc;
      PrintData['Ec'] = Ec;
      PrintData['rfck'] = rfck;
      PrintData['rEc'] = rEc;
      PrintData['rVcd'] = position.pile_factor.rVcd;
      for (const key of Object.keys(position.safety_factor)) {
        if (key in PrintData === false) {
          PrintData[key] = position.safety_factor[key];
        }
      }
    }

    return result;
  }

  // コンクリート強度から弾性係数を 返す
  private getEc(fck: number) {

    const EcList: number[] = [22, 25, 28, 31, 33, 35, 37, 38];
    const fckList: number[] = [18, 24, 30, 40, 50, 60, 70, 80];

    const linear = (x, y) => {
      return (x0) => {
        const index = x.reduce((pre, current, i) => current <= x0 ? i : pre, 0) //数値が何番目の配列の間かを探す
        const i = index === x.length - 1 ? x.length - 2 : index //配列の最後の値より大きい場合は、外挿のために、最後から2番目をindexにする

        return (y[i + 1] - y[i]) / (x[i + 1] - x[i]) * (x0 - x[i]) + y[i] //線形補間の関数を返す
      };
    };

    // 線形補間関数を作成
    const linearEc = linear(fckList, EcList);

    return linearEc(fck);

  }

  // 角度をラジアンに変換
  private Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

  // エラー等があったため この position の postData を 削除する
  private clearPostDataAll(position: any): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key] = new Array();
      i++;
      key = 'PostData' + i.toString();
    }
  }

  // エラー等があったため この position の postData の index番目の要素 を 削除する
  private splicePostDataAll(position: any, index: number): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key].splice(index, 1);
      i++;
      key = 'PostData' + i.toString();
    }
  }

  // この position の postData の 末尾の要素を取り除く
  private popPostDataAll(position: any): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key].pop();
      i++;
      key = 'PostData' + i.toString();
    }
  }

  // この position の postData の 先頭の要素を取り除く
  private shiftPostDataAll(position: any): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key].shift();
      i++;
      key = 'PostData' + i.toString();
    }
  }

}
