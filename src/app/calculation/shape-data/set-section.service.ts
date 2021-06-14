import { Injectable } from '@angular/core';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputDesignPointsService } from 'src/app/components/design-points/design-points.service';
import { InputMembersService } from 'src/app/components/members/members.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';
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
    private members: InputMembersService,
    private points: InputDesignPointsService,
    private bars: InputBarsService,
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private helper: DataHelperModule,
    private circle: SetCircleService,
    private rect: SetRectService,
    private hOval: SetHorizontalOvalService,
    private vOval: SetVerticalOvalService) { }

    
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
  
  public getPostData(target: string, safetyID: number, force: any): any {
    let result: object;

    const index = force.index;
    const position = this.points.getCalcData(index);

    // 部材情報
    const member = this.members.getCalcData(position.m_no);

    // 安全係数
    const safety = this.safety.getCalcData( target, member.g_id, safetyID );

    // 断面形状
    const shapeName = this.getShapeName(member, force.side);

    // 断面情報    
    switch (shapeName) {
      case 'Circle':            // 円形
        result = this.circle.getCircle(member, index, safety);
        break;
      case 'Ring':              // 円環
        result = this.circle.getRing(member, index, safety);
        break;
      case 'Rectangle':         // 矩形
        result = this.rect.getRectangle(target, member, index, force.side, safety);
        break;
      case 'Tsection':          // T形
        result = this.rect.getTsection(target, member, index, force.side, safety);
        break;
      case 'InvertedTsection':  // 逆T形
        result = this.rect.getInvertedTsection(target, member, index, force.side, safety);
        break;
      case 'HorizontalOval':    // 水平方向小判形
        result = this.hOval.getHorizontalOval(member, index, safety);
        break;
      case 'VerticalOval':      // 鉛直方向小判形
        result = this.vOval.getVerticalOval(member, index, safety);
        break;
      default:
        throw("断面形状：" + member.shape + " は適切ではありません。");
    }
    result['shape'] = shapeName;

    return result;
  }



}
