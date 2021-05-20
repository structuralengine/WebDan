import { Injectable } from '@angular/core';
import { InputBarsService } from '../components/bars/bars.service';
import { InputBasicInformationService } from '../components/basic-information/basic-information.service';
import { DataHelperModule } from '../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetSectionService {

  constructor(
    private basic: InputBasicInformationService,
    private bars: InputBarsService,
    private helper: DataHelperModule) {
  }

  // コンクリートを集計する
  // member: 部材・断面情報
  // position: ハンチの情報
  // force: 荷重の情報
  // safety: 安全係数の情報
  public getPostData( member: any, force: any, safety: any): any {
    let result: object;

    const shapeName = this.getShapeName(member, force.side );
    switch(shapeName){
      case 'Circle':            // 円形
        result = this.getCircle(member);
        break;
      case 'Ring':              // 円環
        result = this.getRing(member);
        break;
      case 'Rectangle':         // 矩形
        result = this.getRectangle(member, force);
        break;
      case 'Tsection':          // T形
        result = this.getTsection(member, force);
        break;
      case 'InvertedTsection':  // 逆T形
        result = this.getInvertedTsection(member, force);
        break;
      case 'HorizontalOval':    // 水平方向小判形
        result = this.getHorizontalOval(member);
      break;
      case 'VerticalOval':      // 鉛直方向小判形
        result = this.getVerticalOval(member);
        break;
      default:
        console.log("断面形状：" + member.shape + " は適切ではありません。");
        return null;
    }
    result['shape'] = shapeName;

    // コンクリートの材料情報を集計
    result['SectionElastic'] = [this.getSectionElastic(safety)];

    return result;
  }

  // 断面の入力から形状名を決定する
  public getShapeName(member: any, side: string): string{

    let result: string = null;;

    if (member.shape.indexOf('円') >= 0) {

      if (member.shape.indexOf('円形') >= 0) {
        result = 'Circle';

      } else if (member.shape.indexOf('円環') >= 0) {
        let b: number = this.helper.toNumber(member.B);
        if (b === null || b === 0) {
          result = 'Circle';
        }
        result = 'Ring';

      }

    } else if (member.shape.indexOf('矩形') >= 0) {
      result = 'Rectangle';

    } else if (member.shape.indexOf('T') >= 0) {

      // Ｔ形に関する 設計条件を確認する
      let condition = this.basic.conditions_list.find(e =>
        e.id === 'JR-002');
      if (condition === undefined) { condition = { selected: false }; }

      if (member.shape.indexOf('T形') >= 0) {
        if (condition.selected === true && side === '上側引張') {
          // T形 断面の上側引張は 矩形
          result = 'Rectangle';

        } else {
          const b: number = this.helper.toNumber(member.B);
          if (b === null) { return null; }
          let bf: number = this.helper.toNumber(member.Bt);
          if (bf === b) { bf = null; }
          const hf: number = this.helper.toNumber(member.t);
          if (bf === null && hf == null) {
            result = 'Rectangle';
          }
          result = 'Tsection';

        }
      } else if (member.shape.indexOf('逆T形') >= 0) {
        if (condition.selected === true && side === '下側引張') {
          // 逆T形 断面の下側引張は 矩形
          result = 'Rectangle';

        } else {
          const b: number = this.helper.toNumber(member.B);
          if (b === null) { return null; }
          let bf: number = this.helper.toNumber(member.Bt);
          if (bf === b) { bf = null; }
          const hf: number = this.helper.toNumber(member.t);
          if (bf === null && hf == null) {
            result = 'Rectangle';
          }
          result = 'InvertedTsection';

        }
      }

    } else if (member.shape.indexOf('小判形') >= 0) {

      if (member.B > member.H) {
        result = 'HorizontalOval';

      } else if (member.B < member.H) {
        result = 'VerticalOval';

      } else if (member.B === member.H) {
        result = 'Circle';

      }

    } else {
      console.log("断面形状：" + member.shape + " は適切ではありません。");
      return null;
    }

    return  result;
  }

  // 横小判形断面の POST 用 データ作成
  private getHorizontalOval(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('HorizontalOval', member);
    const h: number = shape.H;
    const b: number = shape.B;

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

    return result;
  }

  // 縦小判形断面の POST 用 データ作成
  private getVerticalOval(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('VerticalOval', member);
    const h: number = shape.H;
    const b: number = shape.B;

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

    return result;
  }

  // T形断面の POST 用 データ作成
  private getInvertedTsection(member: any, force: any): any {

    const result = { symmetry: false, Sections: [] };
    
    // 断面情報を集計
    const shape = this.getShape('InvertedTsection', member, force.target, force.index);
    const h: number = shape.H;
    const b: number =shape.B;
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

    return result;
  }

  // T形断面の POST 用 データ作成
  private getTsection(member: any, force: any): any {
    const result = { symmetry: false, Sections: [] };

    // 断面情報を集計
    const shape = this.getShape('Tsection', member, force.target, force.index);
    const h: number = shape.H;
    const b: number =shape.B;
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

    return result;
  }

  // 矩形断面の POST 用 データ作成
  private getRectangle(member: any, force: any): any {

    const result = { symmetry: true, Sections: [] };
    
    // 断面情報を集計
    const shape = this.getShape('Rectangle', member, force.target, force.index)
    const h: number = shape.H;
    const b: number = shape.B;

    const section = {
      Height: h, // 断面高さ
      WTop: b,        // 断面幅（上辺）
      WBottom: b,     // 断面幅（底辺）
      ElasticID: 'c'  // 材料番号
    };
    result.Sections.push(section);

    return result;
  }

  // 円環断面の POST 用 データ作成
  private getRing(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('Ring', member)
    let h: number = shape.H;
    let b: number = shape.B;
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

    return result;
  }

  // 円形断面の POST 用 データ作成
  private getCircle(member: any): any {
    const result = { symmetry: true, Sections: [] };

    const RCOUNT = 100;

    // 断面情報を集計
    const shape = this.getShape('Circle', member);
    let h: number = shape.H;
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
  public getSectionElastic(safety: any): any {

     const fck = safety.material_concrete.fck;
    const rc = safety.safety_factor.rc;
    const pile = safety.pile_factor.find(e=>e.selected===true);
    const rfck = (pile !== undefined) ? pile.rfck : 1;
    const rEc = (pile !== undefined) ? pile.rEc : 1;
    const Ec = this.getEc(fck);
    const result = {
      fck: rfck * fck / rc,     // コンクリート強度
      Ec: rEc * Ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };

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

  // 断面の幅と高さ（フランジ幅と高さ）を取得する
  public getShape(shapeName: string, member: any,
                  target: string = 'Md', index: number = null): any {

    const result = {};

    let h: number, b: number, bf: number, hf: number, haunch: number;
    let bar: any;

    switch(shapeName){
      case 'Circle':            // 円形
        h = this.helper.toNumber(member.H);
        if (h === null) {
          h = this.helper.toNumber(member.B);
        }
        result['H'] = h;
        break;

      case 'Ring':              // 円環
        result['H'] = this.helper.toNumber(member.H); // 外径
        result['B'] = this.helper.toNumber(member.B); // 内径
        break;

      case 'Rectangle':         // 矩形
        h = this.helper.toNumber(member.H);
        bar = this.bars.getTableColumn(index);
        if (target==='Md'){
          haunch = bar.haunch_M;
        } else if(target==='Vd') {
          haunch =  bar.haunch_V;
        }
        if (this.helper.toNumber(haunch) !== null) {
          h += haunch * 1;
        }
        result['H'] = h;
        result['B'] = this.helper.toNumber(member.B);
        break;

      case 'Tsection':          // T形
      case 'InvertedTsection':  // 逆T形
        h = this.helper.toNumber(member.H);
        bar = this.bars.getTableColumn(index);
        if (target==='Md'){
          haunch = bar.haunch_M;
        } else if(target==='Vd') {
          haunch =  bar.haunch_V;
        }
        if (this.helper.toNumber(haunch) !== null) {
          h += haunch;
        }
        b = this.helper.toNumber(member.B);
        bf = this.helper.toNumber(member.Bt);
        hf = this.helper.toNumber(member.t);
        if (bf === null) { bf = b; }
        if (hf === null) { hf = h; }
        result['B'] = b;
        result['H'] = h;
        result['Bt'] = bf;
        result['t'] = hf;
        break;

      case 'HorizontalOval':    // 水平方向小判形
      case 'VerticalOval':      // 鉛直方向小判形
        h = this.helper.toNumber(member.H);
        result['H'] = h;
        result['B'] = this.helper.toNumber(member.B);
        break;

      default:
        console.log("断面形状：" + member.shape + " は適切ではありません。");
        return null;
    }

    return result;
  }

   // せん断照査用の換算矩形断面を算定
  public getVydBH(shapeName: string, member: any,
                  target: string, index: number): any {

    const result = {};
    const shape = this.getShape(shapeName, member, target, index);

    let h: number, b: number, Area: number, circleArea: number, rectArea: number;

    switch(shapeName){
      case 'Circle':            // 円形
        h = shape.H;
        Area = Math.pow(h, 2) * Math.PI / 4;
        h = Math.sqrt(Area);
        result['H'] = h;
        result['B'] = h;
        break;

      case 'Ring':              // 円環
        h = shape.H; // 外径
        b = shape.B; // 内径
        Area = Math.pow(h, 2) * Math.PI / 4;
        result['H'] = Math.sqrt(Area);
        Area -= (b ** 2) * Math.PI / 4;
        result['B'] = h - Math.sqrt((h ** 2) - Area);
        break;

      case 'Rectangle':         // 矩形
      case 'Tsection':          // T形
      case 'InvertedTsection':  // 逆T形
        result['H'] = shape.H;
        result['B'] = shape.B;
        break;

      case 'HorizontalOval':    // 水平方向小判形
        h = shape.H;
        b = shape.B;
        circleArea = (h ** 2) * Math.PI / 4;
        rectArea = h * (b - h);
        Area = circleArea + rectArea;
        result['H'] = h;
        result['B'] = Area / h;
        break;

      case 'VerticalOval':      // 鉛直方向小判形
        const x = h - b;
        circleArea = (b ** 2) * Math.PI / 4;
        rectArea = b * x;
        Area = circleArea + rectArea;
        result['H'] = Area / b;
        result['B'] = b;

      break;

      default:
      console.log("断面形状：" + member.shape + " は適切ではありません。");
      return null;
    }

    return result;
  }

  // 断面積と断面係数
  public getStructuralVal( shapeName: string, member: any,
                    target: string, index: number): any {

    const result = {};
    const shape = this.getShape(shapeName, member, target, index);

    let h: number, b: number, bf: number, hf: number;
    let a1: number, a2: number, a3: number, a4: number, a5: number;
    let x: number, e1: number, e2: number;
    let Area: number, circleArea: number, rectArea: number;

    switch(shapeName){
    case 'Circle':            // 円形
      h = shape.H;
      result['A'] = Math.pow(h, 2) * Math.PI / 4;
      result['I'] = Math.pow(h, 4) * Math.PI / 64;
      result['eu'] = h / 2;
      result['el'] = h / 2;
      break;

    case 'Ring':              // 円環
      h = shape.H; // 外径
      b = shape.B; // 内径
      result['A'] = (Math.pow(h, 2) - Math.pow(b, 2)) * Math.PI / 4;
      result['I'] = (Math.pow(h, 4) - Math.pow(b, 4)) * Math.PI / 64;
      result['eu'] = h / 2;
      result['el'] = h / 2;
      break;

    case 'Rectangle':         // 矩形
      h = shape.H;
      b = shape.B;
      result['A'] = b * h;
      result['I'] = b * Math.pow(h, 3) / 12;
      result['eu'] = h / 2;
      result['el'] = h / 2;
      break;

    case 'Tsection':          // T形
      h = shape.H;
      b =shape.B;
      bf = shape.Bt;
      hf = shape.t;
      x = bf - b;
      result['A'] = h * b + hf * x;
      a1 = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
      a2 = 2 * (b * h + x * hf);
      e1 = a1 / a2;
      e2 = h - e1;
      result['eu'] = e1;
      result['el'] = e2;
      a3 = bf * Math.pow(e1, 3);
      a4 = x * h;
      a5 = b * Math.pow(e2, 3);
      result['I'] = (a3 - a4 + a5) / 3;
      break;


    case 'InvertedTsection':  // 逆T形
      h = shape.H;
      b =shape.B;
      bf = shape.Bt;
      hf = shape.t;
      x = bf - b;
      result['A'] = h * b + hf * x;
      a1 = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
      a2 = 2 * (b * h + x * hf);
      e1 = a1 / a2;
      e2 = h - e1;
      result['eu'] = e2;
      result['el'] = e1;
      a3 = bf * Math.pow(e1, 3);
      a4 = x * h;
      a5 = b * Math.pow(e2, 3);
      result['I'] = (a3 - a4 + a5) / 3;
      break;

    case 'HorizontalOval':    // 水平方向小判形
      h = shape.H;
      b = shape.B;
      circleArea = (h ** 2) * Math.PI / 4;
      rectArea = h * (b - h);
      Area = circleArea + rectArea;
      result['A'] = Area;
      result['I'] = (Math.pow(h, 4) * Math.PI / 64) + ((b - h) * Math.pow(h, 3) / 12);
      result['eu'] = h / 2;
      result['el'] = h / 2;
      break;

    case 'VerticalOval':      // 鉛直方向小判形
      x = h - b;
      circleArea = (b ** 2) * Math.PI / 4;
      rectArea = b * x;
      Area = circleArea + rectArea;
      a1 = Math.PI * Math.pow(b, 4) / 64;
      a2 = x * Math.pow(b, 3) / 6;
      a3 = Math.PI * Math.pow(x, 2) * Math.pow(b, 2) / 16;
      a4 = b * Math.pow(x, 3) / 12;
      result['A'] = Area;
      result['I'] = a1 + a2 + a3 + a4;
      result['eu'] = h / 2;
      result['el'] = h / 2;

      break;

    default:
      console.log("断面形状：" + member.shape + " は適切ではありません。");
      return null;
    }

    return result;
  }

}
