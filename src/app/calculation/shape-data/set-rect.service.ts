import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetRectService {

  constructor() { }

  // 矩形断面の POST 用 データ作成
  public getRectangle(member: any, force: any): any {

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
    result['member'] = shape;

    return result;
  }

  public getInvertedTsection(member: any, force: any): object {
    throw new Error('Method not implemented.');
  }

  public getTsection(member: any, force: any): object {
    throw new Error('Method not implemented.');
  }


  // 断面の幅と高さ（フランジ幅と高さ）を取得する
  public getShape(shapeName: string, member: any,
    target: string = 'Md', index: number = null): any {

    const result = {};

    let h: number, b: number, bf: number, hf: number, haunch: number;
    let Area: number, circleArea: number, rectArea: number;
    let bar: any;

    switch (shapeName) {

      case 'Rectangle':         // 矩形
        h = this.helper.toNumber(member.H);
        bar = this.bars.getTableColumn(index);
        if (target === 'Md') {
          haunch = bar.haunch_M;
        } else if (target === 'Vd') {
          haunch = bar.haunch_V;
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
        if (target === 'Md') {
          haunch = bar.haunch_M;
        } else if (target === 'Vd') {
          haunch = bar.haunch_V;
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

    }

    return result;
  }

}
