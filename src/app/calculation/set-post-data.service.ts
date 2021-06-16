import { Injectable } from "@angular/core";
import { UserInfoService } from "../providers/user-info.service";
import { InputMembersService } from "../components/members/members.service";
import { InputSafetyFactorsMaterialStrengthsService } from "../components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { HttpHeaders } from "@angular/common/http";
import { InputBasicInformationService } from "../components/basic-information/basic-information.service";
import { InputDesignPointsService } from "../components/design-points/design-points.service";
import { DataHelperModule } from "../providers/data-helper.module";
import { SetCircleService } from "./shape-data/set-circle.service";
import { SetRectService } from "./shape-data/set-rect.service";
import { SetHorizontalOvalService } from "./shape-data/set-horizontal-oval.service";
import { SetVerticalOvalService } from "./shape-data/set-vertical-oval.service";

@Injectable({
  providedIn: "root",
})
export class SetPostDataService {
  constructor(
    private user: UserInfoService,
    private basic: InputBasicInformationService,
    private members: InputMembersService,
    private points: InputDesignPointsService,
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private helper: DataHelperModule,
    private circle: SetCircleService,
    private rect: SetRectService,
    private hOval: SetHorizontalOvalService,
    private vOval: SetVerticalOvalService) { }

  // 計算(POST)するときのヘルパー ///////////////////////////////////////////////////////////////////////////
  public URL: string =
    "https://imj7l5o0xl.execute-api.ap-northeast-1.amazonaws.com/prod/RCNonlinear";

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    })
  };

  public parseJsonString(str: string): any {
    let json: any = null;
    let tmp: any = null;
    try {
      tmp = JSON.parse(str);
      json = JSON.parse(tmp);
    } catch (e) {
      return tmp;
    }
    return json;
  }

  public getInputJsonString(postData: any): string {
    const postObject = {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: postData,
    };
    const inputJson: string = JSON.stringify(postObject);
    return inputJson;
  }

  // サーバーに送信するデータを作成
  // target: 'Md', 'Vd' 安全係数などの選定に用いる
  // type: '応力度', '耐力'
  // safetyID: 安全係数の行番号
  // DesignForceList: 着目点, 断面力情報
  public setInputData( target: string, type: string, safetyID: number,
                      ...DesignForceList: any[] ): any {
    const result = [];

    for(const list of DesignForceList) {
      for (const position of list) {

        // 送信post データの生成
        for (const force of position.designForce) {

          force['index'] = position.index;

          // 断面力の調整
          const data = {
            index: position.index,
            side: force.side,
            Nd: force.Nd
          };
          if(type === "応力度") {
            data['Md'] = Math.abs(force.Md);
          }
          try {
            const shape = this.getPostData(target, safetyID, force);

            // 断面形状
            data['Sections'] = shape.Sections;
            data['SectionElastic'] = shape.SectionElastic;

            // 鉄筋の本数
            data['Steels'] = shape.Steels;
            data['SteelElastic'] = shape.SteelElastic;

            result.push(data);
          } catch(e){
            console.log(e);
          }

        }
      }
    }
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
      throw ("断面形状：" + member.shape + " は適切ではありません。");
    }

    return result;
  }


  private getPostData(target: string, safetyID: number, force: any): any {
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
        result = this.hOval.getHorizontalOval(member, index, force.side, safety);
        break;
      case 'VerticalOval':      // 鉛直方向小判形
        result = this.vOval.getVerticalOval(member, index, force.side, safety);
        break;
      default:
        throw("断面形状：" + shapeName + " は適切ではありません。");
    }
    result['shape'] = shapeName;

    return result;
  }

}
