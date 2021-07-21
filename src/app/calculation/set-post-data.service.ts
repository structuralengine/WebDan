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
    "https://przh0fpakg.execute-api.ap-northeast-1.amazonaws.com/prod/RCNonlinear-2";
    // "https://imj7l5o0xl.execute-api.ap-northeast-1.amazonaws.com/prod/RCNonlinear";

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
  public setInputData( 
    target: string, type: string, safetyID: number,
    option: any, ...DesignForceList: any[] ): any {

    const post_keys = [ 
      'index', 'side', 'Nd','Md',
      'ConcreteElastic', 'Concretes',
      'SteelElastic', 'Bars', 'Steels'
    ];

    const dict = {};
    let key = 0;                    
    for(const list of DesignForceList) {
      for (const position of list) {

        // 送信post データの生成
        for (const force of position.designForce) {

          force['index'] = position.index;

          // 断面力の調整
          const data = {
            index: force.index,
            side: force.side,
            Nd: force.Nd
          };
          if(type === "応力度") {
            data['Md'] = Math.abs(force.Md);
          }
          data['force'] = force; // 一時的に登録
          try {
            const shape = this.getPostData(target, safetyID, force, option);
            data['shape'] = shape; // 一時的に登録
            
            // 断面形状
            data['Concretes'] = shape.Concretes;
            data['ConcreteElastic'] = shape.ConcreteElastic;

            // 鉄筋・鉄骨の本数
            if('Bars' in shape){
              data['Bars'] = shape.Bars;
            }
            if('Steels' in shape){
              data['Steels'] = shape.Steels;
            }
            data['SteelElastic'] = shape.SteelElastic;

            dict[key] = data;
            key++;

          } catch(e){
            console.log(e);
          }

        }
      }
    }

    // 円形など対象な構造物は、上側引張と下側引張の大きい方のみ照査対象とする
    let stock: any = {};
    // 対象でかつ 同じindex のデータを探す
    for(const key of Object.keys(dict)){
      const data = dict[key];
      const index = data.index.toString();
      if(data.shape.symmetry){
        if(index in stock) {
          stock[index].push(key);
        } else {
          stock[index] = [key];
        }
      }
    }
    // target 断面力が 小さい方を探す
    const delete_list = [];
    for(const index of Object.keys(stock)){
      const list = stock[index];
      if(list.length < 2) continue;
      let key1 = list[0];
      let tmp1 = dict[key1];
      for(let j=1; j<list.length; j++){
        const key2 = list[j];
        const tmp2 = dict[key2];
        // 比較
        if(Math.abs(tmp1.force[target]) < Math.abs(tmp2.force[target])){
          delete_list.push(key1);
          tmp1 = tmp2;
        } else {
          delete_list.push(key2);
        }
      }
    }
    // target 断面力が 小さい方を消す
    for(const key of delete_list){
      delete dict[key];
    }

    // 配列に再登録
    const result = [];
    for(const key of Object.keys(dict)){
      const tmp = dict[key];
      const data = {};
      for(const k of post_keys){
        if(k in tmp){
          data[k] = tmp[k];
        }
      }
      result.push(data)
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
          result = 'Tsection';

          const b: number = this.helper.toNumber(member.B);
          if (b === null) { return null; }
          let bf: number = this.helper.toNumber(member.Bt);
          if (bf === b) { bf = null; }
          const hf: number = this.helper.toNumber(member.t);
          if (bf === null && hf == null) {
            result = 'Rectangle';
          }

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

    } else if (member.shape.indexOf('小判') >= 0) {

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

  // option: {
  //  barCenterPosition: 多段配筋の鉄筋を重心位置に全ての鉄筋があるものとす
  // }
  private getPostData(
    target: string, safetyID: number, force: any, option: any): any {

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
        result = this.circle.getCircle(member, index, safety, option);
        break;
      case 'Ring':              // 円環
        result = this.circle.getRing(member, index, safety, option);
        break;
      case 'Rectangle':         // 矩形
        result = this.rect.getRectangle(target, member, index, force.side, safety, option);
        break;
      case 'Tsection':          // T形
        result = this.rect.getTsection(target, member, index, force.side, safety, option);
        break;
      case 'InvertedTsection':  // 逆T形
        result = this.rect.getInvertedTsection(target, member, index, force.side, safety, option);
        break;
      case 'HorizontalOval':    // 水平方向小判形
        result = this.hOval.getHorizontalOval(member, index, force.side, safety, option);
        break;
      case 'VerticalOval':      // 鉛直方向小判形
        result = this.vOval.getVerticalOval(member, index, force.side, safety, option);
        break;
      default:
        throw("断面形状：" + shapeName + " は適切ではありません。");
    }
    result['shape'] = shapeName;

    return result;
  }


}
