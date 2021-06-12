import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SetCircleService } from './set-circle.service';
import { SetHorizontalOvalService } from './set-horizontal-oval.service';
import { SetRectService } from './set-rect.service';
import { SetVerticalOvalService } from './set-vertical-oval.service';

@Injectable({
  providedIn: 'root'
})
export class SetSectionService {

  constructor(
    private basic: InputBasicInformationService,
    private bars: InputBarsService,
    private helper: DataHelperModule,
    private circle: SetCircleService,
    private rect: SetRectService,
    private hOval: SetHorizontalOvalService,
    private vOval: SetVerticalOvalService) { }

  public getPostData(member: any, force: any, safety: any): any {
    let result: object;

    const shapeName = this.getShapeName(member, force.side);
    switch (shapeName) {
      case 'Circle':            // 円形
        result = this.circle.getCircle(member);
        break;
      case 'Ring':              // 円環
        result = this.circle.getRing(member);
        break;
      case 'Rectangle':         // 矩形
        result = this.rect.getRectangle(member, force);
        break;
      case 'Tsection':          // T形
        result = this.rect.getTsection(member, force);
        break;
      case 'InvertedTsection':  // 逆T形
        result = this.rect.getInvertedTsection(member, force);
        break;
      case 'HorizontalOval':    // 水平方向小判形
        result = this.hOval.getHorizontalOval(member);
        break;
      case 'VerticalOval':      // 鉛直方向小判形
        result = this.vOval.getVerticalOval(member);
        break;
      default:
        console.log("断面形状：" + member.shape + " は適切ではありません。");
        return null;
    }
    result['shape'] = shapeName;

    // コンクリートの材料情報を集計
    result['SectionElastic'] = [ this.getSectionElastic(safety) ];

    return result;
  }

    // 断面の入力から形状名を決定する
  public getShapeName(member: any, side: string): string {

    let result: string = null;

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

    return result;
  }

      // コンクリート強度の POST用データを返す
  public getSectionElastic(safety: any): any {

    const fck = this.getFck(safety);

    return {
      fck: fck.fck,     // コンクリート強度
      Ec: fck.Ec,       // コンクリートの弾性係数
      ElasticID: 'c'      // 材料番号
    };

  }


  public getFck(safety: any): any {
    const result = {
      fck: null, rc: null, Ec: null, fcd: null,
      rfck: null, rEc: null, rfbok: null, rVcd: null
    };

    const pile = safety.pile_factor.find((e) => e.selected === true);
    result.rfck = pile !== undefined ? pile.rfck : 1;
    result.rEc = pile !== undefined ? pile.rEc : 1;
    result.rfbok = pile !== undefined ? pile.rfbok : 1;
    result.rVcd = pile !== undefined ? pile.rVcd : 1;

    let rc = safety.safety_factor.rc;

    if ("rc" in safety.safety_factor) {
      result.rc = rc;
    } else {
      rc = 1;
    }

    if ("fck" in safety.material_concrete) {
      const fck = safety.material_concrete.fck;
      result.fck = fck * result.rfck;
      const Ec = this.getEc(result.fck);
      result.Ec = Ec * result.rEc;
      result.fcd = result.rfck * fck / rc;
    }

    return result;
  }

    // コンクリート強度から弾性係数を 返す
    public getEc(fck: number) {

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

}
