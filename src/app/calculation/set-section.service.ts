import { Injectable } from '@angular/core';
import { InputBasicInformationService } from '../components/basic-information/basic-information.service';
import { DataHelperModule } from '../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetSectionService {

  constructor(
    private basic: InputBasicInformationService,
    private helper: DataHelperModule) {
  }

  // コンクリートを集計する
  // member: 部材・断面情報
  // position: ハンチの情報
  // force: 荷重の情報
  // safety: 安全係数の情報
  public setPostData( member: any, bar: any, 
                      force: any, safety: any): any {

    let result: object;

    // POST 用の断面情報をセット
    if (member.shape.indexOf('円') >= 0) {

      if (member.shape.indexOf('円形') >= 0) {
        result = this.getCircle(member);
        if(result ===null){ return null; }

      } else if (member.shape.indexOf('円環') >= 0) {
        result = this.getRing(member);
        if(result ===null){ return null; }

      }

    } else if (member.shape.indexOf('矩形') >= 0) {
      result = this.getRectangle(member, bar);
      if(result ===null){ return null; }

    } else if (member.shape.indexOf('T') >= 0) {

      // Ｔ形に関する 設計条件を確認する
      let condition = this.basic.conditions_list.find(e =>
        e.id === 'JR-002');
      if (condition === undefined) { condition = { selected: false }; }

      if (member.shape.indexOf('T形') >= 0) {
        if (condition.selected === true && force.side === '上側引張') {
          // T形 断面の上側引張は 矩形
          result = this.getRectangle(member, bar);
          if(result ===null){ return null; }

        } else {
          result = this.getTsection(member, bar);
          if(result ===null){ return null; }

        }
      } else if (member.shape.indexOf('逆T形') >= 0) {
        if (condition.selected === true && force.side === '下側引張') {
          // 逆T形 断面の下側引張は 矩形
          result = this.getRectangle(member, bar);
          if(result ===null){ return null; }

        } else {
          result = this.getInvertedTsection(member, bar);
          if(result ===null){ return null; }

        }
      }

    } else if (member.shape.indexOf('小判形') >= 0) {

      if (member.B > member.H) {
        result = this.getHorizontalOval(member);
        if(result ===null){ return null; }

      } else if (member.B < member.H) {
        result = this.getVerticalOval(member);
        if(result ===null){ return null; }

      } else if (member.B === member.H) {
        result = this.getCircle(member);
        if(result ===null){ return null; }

      }

    } else {
      console.log("断面形状：" + member.shape + " は適切ではありません。");
      return null;
    }

    // コンクリートの材料情報を集計
    result['SectionElastic'] = this.setSectionElastic(safety);

    return result;
  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOval(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    let b: number = this.helper.toNumber(member.B);
    if (b === null) { return null; }

    const steps = 180 / RCOUNT;

    let olddeg = 0;
    for (let deg = steps; deg <= 180; deg += steps) {
      const section = {
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * h / 2, // 断面高さ
        WTop: b - h + Math.sin(this.Radians(olddeg)) * h, // 断面幅（上辺）
        WBottom: b - h + Math.sin(this.Radians(deg)) * h, // 断面幅（底辺
        ElasticID: 'c'                                    // 材料番号
      };
      result.Sections.push(section);
      olddeg = deg;
    }

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'HorizontalOval'; // 形状
    result['B'] = b; // 断面幅
    result['H'] = h; // 断面高さ

    // せん断照査用の換算矩形断面を算定
    const circleArea: number = (h ** 2) * Math.PI / 4;
    const rectArea: number = h * (b - h);
    const Area = circleArea + rectArea;
    result['Vyd_H'] = h;
    result['Vyd_B'] = Area / h;

    // 断面積と断面係数
    result['A'] = Area;
    result['I'] = (Math.pow(h, 4) * Math.PI / 64) + ((b - h) * Math.pow(h, 3) / 12);
    result['eu'] = h / 2;
    result['el'] = h / 2;

    return result;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOval(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    let b: number = this.helper.toNumber(member.B);
    if (b === null) { return null; }

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
        Height: (Math.cos(this.Radians(olddeg)) - Math.cos(this.Radians(deg))) * b / 2,  // 断面高さ
        WTop: Math.sin(this.Radians(olddeg)) * b, // 断面幅（上辺）
        WBottom: Math.sin(this.Radians(deg)) * b, // 断面幅（底辺
        ElasticID: 'c'                            // 材料番号
      };
      result.Sections.push(section3);
      olddeg = deg;
    }

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'VerticalOval'; // 形状

    result['B'] = b;
    result['H'] = h;

    // せん断照査用の換算矩形断面を算定
    const x = h - b;
    const circleArea: number = (b ** 2) * Math.PI / 4;
    const rectArea: number = b * x;
    const Area = circleArea + rectArea;
    const Vyd_H = Area / b;
    result['Area'] = Area;
    result['Vyd_H'] = Vyd_H;
    result['Vyd_B'] = b;

    // 断面積と断面係数
    result['A'] = Area;
    const a1: number = Math.PI * Math.pow(b, 4) / 64;
    const a2: number = x * Math.pow(b, 3) / 6;
    const a3: number = Math.PI * Math.pow(x, 2) * Math.pow(b, 2) / 16;
    const a4: number = b * Math.pow(x, 3) / 12;
    result['I'] = a1 + a2 + a3 + a4;
    result['eu'] = h / 2;
    result['el'] = h / 2;

    return result;
  }

  // T形断面の POST 用 データ作成
  private getInvertedTsection(member: any, bar: any): any {
    const result = { symmetry: false, Sections: [] };

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    if (this.helper.toNumber(bar.haunch_M) !== null) {
      h += bar.haunch_M;
    }
    const b: number = this.helper.toNumber(member.B);
    if (b === null) { return null; }
    let bf: number = this.helper.toNumber(member.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.helper.toNumber(member.t);
    if (bf === null && hf == null) {
      return this.getRectangle(member, bar);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

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

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'InvertedTsection'; // 形状
    result['B'] = b;
    result['H'] = h;
    result['Bt'] = bf;
    result['t'] = hf;

    // せん断照査用の換算矩形断面を算定
    result['Vyd_H'] = h;
    result['Vyd_B'] = b;

    // 断面積と断面係数
    const x: number = bf - b;
    result['A'] = h * b + hf * x;
    const a1: number = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
    const a2: number = 2 * (b * h + x * hf);
    const e1: number = a1 / a2;
    const e2: number = h - e1;
    result['eu'] = e2;
    result['el'] = e1;
    const a3: number = bf * Math.pow(e1, 3);
    const a4: number = x * h;
    const a5: number = b * Math.pow(e2, 3);
    result['I'] = (a3 - a4 + a5) / 3;

    return result;
  }

  // T形断面の POST 用 データ作成
  private getTsection(member: any, bar: any): any {
    const result = { symmetry: false, Sections: [] };

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    if (this.helper.toNumber(bar.haunch_M) !== null) {
      h += bar.haunch_M;
    }
    const b: number = this.helper.toNumber(member.B);
    if (b === null) { return null; }
    let bf: number = this.helper.toNumber(member.Bt);
    if (bf === b) { bf = null; }
    let hf: number = this.helper.toNumber(member.t);
    if (bf === null && hf == null) {
      return this.getRectangle(member, bar);
    }
    if (bf === null) { bf = b; }
    if (hf === null) { hf = h; }

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

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'Tsection'; // 形状
    result['B'] = b;
    result['H'] = h;
    result['Bt'] = bf;
    result['t'] = hf;

    // せん断照査用の換算矩形断面を算定
    result['Vyd_H'] = h;
    result['Vyd_B'] = b;

    // 断面積と断面係数
    const x: number = bf - b;
    result['A'] = h * b + hf * x;
    const a1: number = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
    const a2: number = 2 * (b * h + x * hf);
    const e1: number = a1 / a2;
    const e2: number = h - e1;
    result['eu'] = e1;
    result['el'] = e2;
    const a3: number = bf * Math.pow(e1, 3);
    const a4: number = x * h;
    const a5: number = b * Math.pow(e2, 3);
    result['I'] = (a3 - a4 + a5) / 3;

    return result;
  }

  // 矩形断面の POST 用 データ作成
  private getRectangle(member: any, bar: any): any {
    const result = { symmetry: false, Sections: [] };

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    if (this.helper.toNumber(bar.haunch_M) !== null) {
      h += bar.haunch_M * 1;
    }
    const b: number = this.helper.toNumber(member.B);
    if (b === null) { return null; }

    const section = {
      Height: h, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    result.Sections.push(section);

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'Rectangle'; // 形状
    result['B'] = b;
    result['H'] = h;

    // せん断照査用の換算矩形断面を算定
    result['Vyd_H'] = h;
    result['Vyd_B'] = b;

    // 断面積と断面係数
    result['A'] = b * h;
    result['I'] = b * Math.pow(h, 3) / 12;
    result['eu'] = h / 2;
    result['el'] = h / 2;

    return result;
  }

  // 円環断面の POST 用 データ作成
  private getRing(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) { return null; }
    let b: number = this.helper.toNumber(member.B);
    if (b === null) { return this.getCircle(member); }
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
      result.Sections.push(section);
      b1 = b2;
      b3 = b4;
    }

    result['shape'] = 'Ring';  // 形状
    result['R'] = h;           // 外径
    result['r'] = b;           // 内径

    // せん断照査用の換算矩形断面を算定
    let Area = Math.pow(h, 2) * Math.PI / 4;
    const Vyd_H = Math.sqrt(Area);
    result['Vyd_H'] = Vyd_H;
    Area -= (b ** 2) * Math.PI / 4;
    result['Vyd_B'] = h - Math.sqrt((h ** 2) - Area);

    // 断面積と断面係数
    result['A'] = (Math.pow(h, 2) - Math.pow(b, 2)) * Math.PI / 4;
    result['I'] = (Math.pow(h, 4) - Math.pow(b, 4)) * Math.PI / 64;
    result['eu'] = h / 2;
    result['el'] = h / 2;

    return result;
  }

  // 円形断面の POST 用 データ作成
  private getCircle(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    let h: number = this.helper.toNumber(member.H);
    if (h === null) {
      h = this.helper.toNumber(member.B);
    }
    if (h === null) { return null; }
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
      result.Sections.push(section);
      b1 = b2;
    }

    // 照査表印字のための変数 print に値を登録
    result['shape'] = 'Circle'; // 形状
    result['R'] = h;

    // せん断照査用の換算矩形断面を算定
    const Area = Math.pow(h, 2) * Math.PI / 4;
    const Vyd_H = Math.sqrt(Area);
    result['Vyd_H'] = Vyd_H;
    result['Vyd_B'] = Vyd_H;

    // 断面積と断面係数
    result['A'] = Math.pow(h, 2) * Math.PI / 4;
    result['I'] = Math.pow(h, 4) * Math.PI / 64;
    result['eu'] = h / 2;
    result['el'] = h / 2;

    return result;
  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2));

    return Math.abs(2 * c);

  }


  // コンクリート強度の POST用データを返す
  private setSectionElastic(safety: any): any[] {

    const result = [];

    const fck = safety.material_concrete.fck;
    const rc = safety.safety_factor.rc;
    const pile = safety.pile_factor.find(e=>e.selected===true);
    const rfck = (pile !== undefined) ? pile.rfck : 1;
    const rEc = (pile !== undefined) ? pile.rEc : 1;
    const Ec = this.getEc(fck);
    const elastic = {
      fck: rfck * fck / rc,     // コンクリート強度
      Ec: rEc * Ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };
    result.push(elastic);

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

  public getShapeString(member: any, bar: any,
                        force: any, safety: any,
                        result: any): any {

    let result: object;

    // 鉄筋情報を 集計
    if (result.shape === 'Circle') {
      result = this.getCircle(member);

    } else if ( result.shape === 'Ring' ){
      result = this.getRing(member);

    } else if ( result.shape === 'Rectangle' ){
      result = this.getRectangle(member, bar);

    } else if ( result.shape === 'Tsection'  ){
      result = this.getTsection(member, bar);

    } else if ( result.shape === 'InvertedTsection') {
      result = this.getInvertedTsection(member, bar);

    } else if (result.shape === 'HorizontalOval') {
      result = this.getHorizontalOval(member);

    } else if (result.shape === 'VerticalOval') {
      result = this.getVerticalOval(member);

    } else {
    console.log("断面形状：" + result.shape + " は適切ではありません。");
    return null;
    }

    return result;
  }

}
