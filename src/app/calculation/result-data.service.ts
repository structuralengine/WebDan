import { Injectable } from "@angular/core";
import { DataHelperModule } from "../providers/data-helper.module";
import { InputBarsService } from "../components/bars/bars.service";
import { SetPostDataService } from "./set-post-data.service";
import { InputDesignPointsService } from "../components/design-points/design-points.service";
import { InputMembersService } from "../components/members/members.service";
import { SetRectService } from "./shape-data/set-rect.service";
import { SetCircleService } from "./shape-data/set-circle.service";
import { SetHorizontalOvalService } from "./shape-data/set-horizontal-oval.service";
import { SetVerticalOvalService } from "./shape-data/set-vertical-oval.service";

@Injectable({
  providedIn: "root",
})
export class ResultDataService {
  constructor(
    private members: InputMembersService,
    private points: InputDesignPointsService,
    private bars: InputBarsService,
    private post: SetPostDataService,
    private helper: DataHelperModule,
    private circle: SetCircleService,
    private rect: SetRectService,
    private hOval: SetHorizontalOvalService,
    private vOval: SetVerticalOvalService) { }

  // 表題の共通した行
  public getTitleString(member: any, position: any, side: string): any {
    // 照査表における タイトル１行目を取得
    let strPos = "";
    if (this.helper.toNumber(position.position) !== null) {
      strPos = position.position.toFixed(3);
    }
    const m_no: string = member.m_no.toFixed(0);
    let title1: string = m_no + "部材";
    if (member.m_len > 0) {
      title1 += "(" + strPos + ")";
    }

    // 照査表における タイトル２行目を取得
    const title2: string = position.p_name; // + side;

    // 照査表における タイトル３行目を取得
    const bar = this.bars.getCalcData(position.index);

    let title3: string = '';
    if(side === '上側引張'){
      title3 = bar.rebar1.title + '引張';
    } else {
      title3 = bar.rebar2.title + '引張';
    }

    return {
      m_no: title1,
      p_name: title2,
      side: title3,
    };
  }

  // value が null なら center 寄せ の -
  public alien(value: any, alien: string = "right"): any {
    let result: object;
    if (value === null) {
      result = { alien: "center", value: "-" };
    } else {
      result = { alien, value };
    }
    return result;
  }

  // 整数なら Fixed(0), 少数なら dim で指定した少数で丸める
  public numStr(dst: number, dim: number = 2): string{

    if ( dst === null ){
      return null;
    }

    return dst.toFixed(Number.isInteger(dst)? 0 : dim )
  }

  // 照査表における 断面の文字列を取得
  public getSection(target: string, res: any, safety: any): any {

    const result = {};

    const index = res.index;
    const side = res.side;

    const position = this.points.getCalcData(index);

    // 部材情報
    const member = this.members.getCalcData(position.m_no);
    result['member'] = member;

    // 断面形状
    const shapeName = this.post.getShapeName(member, side);
    result['shapeName'] = shapeName;

    // 断面情報
    let shape: any, Ast: any;
    switch (shapeName) {
      case 'Circle':            // 円形
        if(target === 'Md'){
          shape = this.circle.getCircleShape(member);
        } else {
          shape = this.circle.getCircleVdShape(member);
        }
        break;
      case 'Ring':              // 円環
        if(target === 'Md'){
          shape = this.circle.getRingShape(member);
        } else {
          shape = this.circle.getRingVdShape(member);
        }
        break;
      case 'Rectangle':         // 矩形
      case 'Tsection':          // T形
      case 'InvertedTsection':  // 逆T形
        shape = this.rect.getShape(shapeName, member, target, index);
        break;
      case 'HorizontalOval':    // 水平方向小判形
        shape = this.hOval.getShape(member);
        break;
      case 'VerticalOval':      // 鉛直方向小判形
        shape = this.vOval.getShape(member);
        break;
      default:
        throw("断面形状：" + member.shape + " は適切ではありません。");
    }

    result['shape'] = shape;


    return result;
  }

}
