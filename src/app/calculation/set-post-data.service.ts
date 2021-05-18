import { Injectable } from "@angular/core";
import { UserInfoService } from "../providers/user-info.service";
import { InputMembersService } from "../components/members/members.service";
import { InputBarsService } from '../components/bars/bars.service';
import { InputSafetyFactorsMaterialStrengthsService } from "../components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { SetSectionService } from "./set-section.service";
import { SetBarService } from "./set-bar.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SetPostDataService {
  constructor(
    private user: UserInfoService,
    private section: SetSectionService,
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private members: InputMembersService,
    private bars: InputBarsService,
    private steel: SetBarService) {}

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
        // 部材情報
        const member = this.members.getCalcData(position.m_no);
        // 安全係数
        const safety = this.safety.getCalcData( target, member.g_id, safetyID );

        // 送信post データの生成
        for (const force of position.designForce) {

          // 断面力の調整
          const data = {
            index: position.index,
            side: force.side,
            Nd: force.Nd
          };
          if(type === "応力度") {
            data['Md'] = Math.abs(force.Md);
          }

          // 断面形状
          const section = this.section.setPostData(target, member, force, safety);
          data['Sections'] = section.Sections;
          data['SectionElastic'] = section.SectionElastic;

          // 鉄筋の本数
          const steel = this.steel.setPostData(member, force, safety, section);
          data['Steels'] = steel.Steels;
          data['SteelElastic'] = steel.SteelElastic;

          result.push(data);
        }
      }
    }
    return result;
  }

}
