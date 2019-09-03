import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';
import { SetBarService } from './set-bar.service';

@Injectable({
  providedIn: 'root'
})
export class SetSectionService {

  constructor(private save: SaveDataService,
    private bar: SetBarService) {
  }

  // position に コンクリート・鉄筋情報を入力する /////////////////////////////////////////////////////////////////////
  public setPostData(g_no: number, m_no: number, position: any): void {

    // 部材・断面情報をセット
    const memberInfo = this.save.members.member_list.find(function (value) {
      return (value.m_no === m_no);
    });
    if (memberInfo === undefined) {
      console.log('部材番号が存在しない');
      position.PostData = new Array();
      return;
    }
    // 断面
    position['memberInfo'] = memberInfo;
    // 出力用の変数の用意する
    position['printData'] = JSON.parse(
      JSON.stringify({
        temp: position.PostData
      })
    ).temp;

    // 鉄筋の入力情報ををセット
    this.bar.setBarData(g_no, m_no, position);

    // POST 用の断面情報をセット
    if (memberInfo.shape.indexOf('円') >= 0) {

      // 円形の場合は 上側引張、下側引張　どちらかにする
      if (position.PostData.length > 1) {
        if (Math.abs(position.PostData[0]) > Math.abs(position.PostData[1])) {
          position.PostData.pop(); // 末尾の要素を取り除く
          position.printData.pop();
        } else {
          position.PostData.shift(); // 先頭の要素を取り除く
          position.printData.shift();
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
        position.PostData = new Array();
        return;
      }

    } else if (memberInfo.shape.indexOf('矩形') >= 0) {

      for (let i = position.PostData.length - 1; i >= 0; i--) {
        if (this.getRectangle(position, i) === false) {
          position.PostData.splice(i, 1);
        }
      }

    } else if (memberInfo.shape.indexOf('T') >= 0) {

      // Ｔ形に関する 設計条件を確認する
      let condition = this.save.basic.conditions_list.find(function (value) {
        return (value.id === 'JR-002');
      });
      if (condition === undefined) {
        condition = { id: 'undefined', selected: false };
      }

      for (let i = position.PostData.length - 1; i >= 0; i--) {
        let isEnable: boolean;
        if (memberInfo.shape.indexOf('T形') >= 0) {
          if (condition.selected === true && position.PostData[i].memo === '上側引張') {
            // T形 断面の上側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getTsection(position, i);
          }
        } else if (memberInfo.shape.indexOf('逆T形') >= 0) {
          if (condition.selected === true && position.PostData[i].memo === '下側引張') {
            // 逆T形 断面の下側引張は 矩形
            isEnable = this.getRectangle(position, i);
          } else {
            isEnable = this.getInvertedTsection(position, i);
          }
        } else {
          isEnable = false;
        }
        if (isEnable === false) {
          position.PostData.splice(i, 1);
        }

      }

    } else if (memberInfo.shape.indexOf('小判形') >= 0) {

      // 小判形の場合は 上側引張、下側引張　どちらかにする
      if (position.PostData.length > 1) {
        if (Math.abs(position.PostData[0]) > Math.abs(position.PostData[1])) {
          position.PostData.pop(); // 末尾の要素を取り除く
          position.printData.pop();
        } else {
          position.PostData.shift(); // 先頭の要素を取り除く
          position.printData.shift();
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
        position.PostData = new Array();
        return;
      }

    } else {
      console.log("断面形状：" + memberInfo.shape + " は適切ではありません。");
      position.PostData = new Array();
      return;
    }

  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOval(position: any): boolean {
    const PostData = position.PostData[0];
    const printData = position.printData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.save.toNumber(position.memberInfo.B);
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
    printData['B'] = b;
    printData['H'] = h;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, '横小判', h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars);
      // せん断照査用の換算矩形断面を算定
      const circleArea: number = (h ** 2) * Math.PI / 4;
      const rectArea: number = h * (b - h);
      const Area = circleArea + rectArea;
      printData['Vyd_H'] = h;
      printData['Vyd_B'] = Area / h;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;
    } else {
      return false;
    }

    return true;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOval(position: any): boolean {
    const PostData = position.PostData[0];
    const printData = position.printData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.save.toNumber(position.memberInfo.B);
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
    printData['B'] = b;
    printData['H'] = h;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getVerticalOvalBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars);
      // せん断照査用の換算矩形断面を算定
      const circleArea: number = (b ** 2) * Math.PI / 4;
      const rectArea: number = b * (h - b);
      const Area = circleArea + rectArea;
      printData['Vyd_H'] = Area / b;
      printData['Vyd_B'] = b;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;
    } else {
      return false;
    }

    return true;
  }

  // T形断面の POST 用 データ作成
  private getInvertedTsection(position: any, index: number): boolean {
    const PostData = position.PostData[index];
    const printData = position.printData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.save.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.save.toNumber(position.memberInfo.t);
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
    printData['B'] = b;
    printData['H'] = h;
    printData['Bt'] = bf;
    printData['t'] = hf;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars);
      // せん断照査用の換算矩形断面を算定
      printData['Vyd_H'] = h;
      printData['Vyd_B'] = b;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;
    } else {
      return false;
    }

    return true;
  }

  // T形断面の POST 用 データ作成
  private getTsection(position: any, index: number): boolean {
    const PostData = position.PostData[index];
    const printData = position.printData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }
    let bf: number = this.save.toNumber(position.memberInfo.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.save.toNumber(position.memberInfo.t);
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
    printData['B'] = b;
    printData['H'] = h;
    printData['Bt'] = bf;
    printData['t'] = hf;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars);
      // せん断照査用の換算矩形断面を算定
      printData['Vyd_H'] = h;
      printData['Vyd_B'] = b;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;
    } else {
      return false;
    }

    return true;
  }

  // 矩形断面の POST 用 データ作成
  private getRectangle(position: any, index: number): boolean {
    const PostData = position.PostData[index];
    const printData = position.printData[index];

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    if (this.save.toNumber(position.barData.haunch_M) !== null) {
      h += position.barData.haunch_M;
    }
    const b: number = this.save.toNumber(position.memberInfo.B);
    if (b === null) { return false; }

    const section = {
      Height: h, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    PostData.Sections.push(section);
    printData['B'] = b;
    printData['H'] = h;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getRectBar(position, PostData.memo, h);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars);
      // せん断照査用の換算矩形断面を算定
      printData['Vyd_H'] = h;
      printData['Vyd_B'] = b;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;
    } else {
      return false;
    }

    return true;
  }

  // 円環断面の POST 用 データ作成
  private getRing(position: any): boolean {
    const PostData = position.PostData[0];
    const printData = position.printData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
    if (h === null) { return false; }
    let b: number = this.save.toNumber(position.memberInfo.B);
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
    printData['B'] = 'R' + h;
    printData['H'] = 'r' + b;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getCircleBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars, ['Ast', 'Aw']);
      // せん断照査用の換算矩形断面を算定
      let Area = (h ** 2) * Math.PI / 4;
      printData['Vyd_H'] = Math.sqrt(Area);
      Area -= (b ** 2) * Math.PI / 4;
      printData['Vyd_B'] = h - Math.sqrt((h ** 2) - Area);
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;

    } else {
      return false;
    }

    return true;
  }

  // 円形断面の POST 用 データ作成
  private getCircle(position: any): boolean {
    const PostData = position.PostData[0];
    const printData = position.printData[0];

    const RCOUNT = 100;

    // 断面情報を集計
    PostData['Sections'] = new Array();
    let h: number = this.save.toNumber(position.memberInfo.H);
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
    printData['B'] = 'R' + h;

    // コンクリートの材料情報を集計
    const sectionElastic = this.setSectionElastic(position);
    PostData['SectionElastic'] = sectionElastic;

    // 鉄筋情報を 集計
    const bars = this.bar.getCircleBar(position);
    if (bars !== null) {
      PostData['Steels'] = bars.Steels;
      PostData['SteelElastic'] = bars.SteelElastic;
      this.bar.setBarAtPrintData(printData, bars, ['Ast', 'Aw']);
      // せん断照査用の換算矩形断面を算定
      const Area = (h ** 2) * Math.PI / 4;
      printData['Vyd_H'] = Math.sqrt(Area);
      printData['Vyd_B'] = printData.Vyd_H;
      let n: number = 0;
      let nDepth: number = 0;
      for (const b of bars) {
        if (b.IsTensionBar === true) {
          n += b.n;
          nDepth += (b.Depth * b.n);
        }
      }
      printData['Vyd_d'] = nDepth / n;

    } else {
      return false;
    }

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
    const Ec = this.getEc(fck);
    const elastic = {
      fck: fck / rc,     // コンクリート強度
      Ec: Ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    result.push(elastic);
    // 印刷用の変数に登録
    for (const printData of position.printData) {
      printData['fck'] = fck;
      printData['rc'] = rc;
      printData['Ec'] = Ec;
    }
    return result;
  }

  // コンクリート強度から弾性係数を 返す
  private getEc(fck: number) {

    const EcList: number[] = [22, 25, 28, 31, 33, 35, 37, 38];
    const fckList: number[] = [18, 24, 30, 40, 50, 60, 70, 80];

    let i: number;
    const j: number = fckList.length - 1;

    let x1: number;
    let x2: number;
    let y1: number;
    let y2: number;
    if (fckList[0] >= fck) {
      x1 = fckList[0];
      x2 = fckList[1];
      y1 = EcList[0];
      y2 = EcList[1];
    } else if (fckList[j] <= fck) {
      i = j;
    } else {
      for (i = 0; i < fckList.length; i++) {
        if (fckList[i] >= fck) {
          break;
        }
      }
      x1 = fckList[i - 1];
      x2 = fckList[i];
      y1 = EcList[i - 1];
      y2 = EcList[i];
    }
    return y2 + (x2 - fck) * (y1 - y2) / (x2 - x1);
  }

  // 角度をラジアンに変換
  private Radians(degree: number) {
    return degree * (Math.PI / 180);
  }

}
