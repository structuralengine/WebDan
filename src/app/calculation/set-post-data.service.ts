import { Injectable } from "@angular/core";
import { UserInfoService } from "../providers/user-info.service";
import { InputMembersService } from "../components/members/members.service";
import { InputBarsService } from '../components/bars/bars.service';
import { InputSafetyFactorsMaterialStrengthsService } from "../components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { HttpHeaders } from "@angular/common/http";
import { SetSectionService } from "./shape-data/set-section.service";

@Injectable({
  providedIn: "root",
})
export class SetPostDataService {
  constructor(
    private user: UserInfoService,
    private section: SetSectionService ) {}

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
            const shape = this.section.getPostData(target, safetyID, force);

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

}
