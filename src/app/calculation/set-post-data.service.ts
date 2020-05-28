import { Injectable } from '@angular/core';

import { UserInfoService } from '../providers/user-info.service';
import { SaveDataService } from '../providers/save-data.service';
import { SetSectionService } from './set-section.service';
import { SetSafetyFactorService } from './set-safety-factor.service';


@Injectable({
  providedIn: 'root'
})
export class SetPostDataService {

  constructor(private user: UserInfoService,
    private save: SaveDataService,
    private section: SetSectionService,
    private safety: SetSafetyFactorService) { }

  // 計算(POST)するときのヘルパー ///////////////////////////////////////////////////////////////////////////
  public URL: string = 'https://imj7l5o0xl.execute-api.ap-northeast-1.amazonaws.com/prod/RCNonlinear';

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

  // サーバーに送信するデータを作成
  public setInputData(
    DesignForceList: any[],
    SafetyFactorIndex: number,
    calcTarget: string,
    calcMode: string,
    caseCount: number
  ): any {

    const result: any = {};

    for (let i = 0; i < caseCount; i++) {
      const key: string = 'InputData' + i.toString();
      result[key] = new Array();
    }

    for (const groupe of DesignForceList) {
      for (const member of groupe) {
        for (const position of member.positions) {
          if (position.PostData0 === undefined){
            continue;
          }
          // 安全係数を position['safety_factor'], position['material_steel']
          // position['material_concrete'], position['pile_factor'] に登録する
          this.safety.setSafetyFactor(calcTarget, member.g_no, position, SafetyFactorIndex);

          // 鉄筋の本数・断面形状を position['PostData'] に登録
          // 出力用の string を position['printData'] に登録
          this.section.setPostData(member.g_no, member.m_no, position);

          // 変数に登録
          for (let i = 0; i < caseCount; i++) {
            const postKey: string = 'PostData' + i.toString();
            for (const section of position[postKey]) {
              switch (calcMode) {
                case '耐力':
                  delete section.Md;  // 設計断面力データ Md の入力がない場合、断面の耐力を計算します。
                  break;
                case '応力度':
                  section.Md = Math.abs(section.Md);
                  break;
              }
              const inputKey: string = 'InputData' + i.toString();
              result[inputKey].push(section);
            }
          }
        }
      }
    }
    return result;
  }


  // position に PostData を追加する
  // DesignForceList　を複数指定できる。最初の DesignForceList が基準になる
  public setPostData(DesignForceListList: any[], calcTarget: string): void {

    const baseDesignForceList: any[] = DesignForceListList[0];

    for (let ig = 0; ig < baseDesignForceList.length; ig++) {
      const groupe = baseDesignForceList[ig];
      for (let im = 0; im < groupe.length; im++) {
        const member = groupe[im];
        // 部材・断面情報をセット
        const memberInfo = this.save.members.member_list.find(function (value) {
          return (value.m_no === member.m_no);
        });
        if (memberInfo === undefined) {
          console.log('部材番号が存在しない');
          continue;
        }
        for (let ip = 0; ip < member.positions.length; ip++) {
          const position = member.positions[ip];
          // 断面
          position['memberInfo'] = memberInfo;
          // ピックアップ断面力から設計断面力を選定する
          for (let fo = 0; fo < position.designForce.length; fo++) {
            // 対象の断面力を抽出する
            const force: any[] = new Array();
            for (const target of DesignForceListList) {
              let designForce: any;
              try {
                designForce = target[ig][im].positions[ip].designForce[fo];
              } catch {
                designForce = null;
              }
              force.push(designForce);
            }
            // ピックアップ断面力から設計断面力を選定する
            let sectionForce: any[];
            sectionForce = this.getSectionForce(force, calcTarget);
            // postData に登録する
            for (let icase = 0; icase < sectionForce.length; icase++) {
              position['PostData' + icase.toString()] = sectionForce[icase];
            }
          }
          // 必要ないので消す！！
          delete position.designForce;
        }
      }
    }
  }

  // 設計断面力（リスト）を生成する
  public getSectionForce(forceListList: any[], calcTarget: string): any[] {

    // 設計断面の数をセット
    const result: any[] = new Array();

    if ('Manual' in forceListList[0]) {

      // 断面手入力モードの場合は 設計断面 1つ
      if (forceListList[0].Manual === undefined) {
        return result;
      }
      let num = 0;
      if ('Md' in forceListList[0].Manual) {
        num = this.save.toNumber(forceListList[0].Manual.Md);
        num = (num === null) ? 0 : num;
      } else {
        return result;
      }
      const side = (num > 0) ? '下側引張' : '上側引張';
      for (const forceList of forceListList) {
        let fo: any;
        if (forceList === null) {
          fo = {
            memo: side,
            Md: 0,
            Vd: 0,
            Nd: 0
          };
        } else {
          fo = {
            memo: side,
            Md: forceList.Manual.Md / forceList.n,
            Vd: forceList.Manual.Vd / forceList.n,
            Nd: forceList.Manual.Nd / forceList.n
          };
        }
        result.push([fo]);
      }

    } else {
      let maxKey: string = calcTarget + 'max';      
      let minKey: string = calcTarget + 'min';   
      
      if (Math.sign(forceListList[0][maxKey].Md) === Math.sign(forceListList[0][minKey].Md)) {
        // Mdmax, Mdmin の符号が同じなら 設計断面 1つ
        const side = (forceListList[0][maxKey].Md > 0) ? '下側引張' : '上側引張';
        const key: string = (Math.abs(forceListList[0][maxKey][calcTarget]) > Math.abs(forceListList[0][minKey][calcTarget])) ? maxKey : minKey;
        for (const forceList of forceListList) {
          let fo: any;
          if (forceList === null) {
            fo = { memo: side, Md: 0, Vd: 0, Nd: 0 };
          } else {
            const force = forceList[key];
            fo = {
              memo: side,
              Md: force.Md / forceList.n,
              Vd: force.Vd / forceList.n,
              Nd: force.Nd / forceList.n,
              comb: force.comb
            };
          }
          result.push([fo]);
        }
      } else {
        // Mdmax, Mdmin の符号が異なるなら 設計断面 2つ
        for (const forceList of forceListList) {
          let upper: any;
          let lower: any;
          if (forceList === null) {
            upper = { memo: '上側引張', Md: 0, Vd: 0, Nd: 0 };
            lower = { memo: '下側引張', Md: 0, Vd: 0, Nd: 0 };
          } else {
            let forceMin = forceList[minKey];
            let forceMax = forceList[maxKey];
            if (forceList[maxKey].Md < 0) {
              // せん断の場合などで、Mdが負のケース（上側引張 ）が maxKey の場合 入れ替える
              forceMin = forceList[maxKey];
              forceMax = forceList[minKey];
            }
            upper = {
              memo: '上側引張',
              Md: forceMin.Md / forceList.n,
              Vd: forceMin.Vd / forceList.n,
              Nd: forceMin.Nd / forceList.n,
              comb: forceMin.comb
            };
            lower = {
              memo: '下側引張',
              Md: forceMax.Md / forceList.n,
              Vd: forceMax.Vd / forceList.n,
              Nd: forceMax.Nd / forceList.n,
              comb: forceMax.comb
            };
          }
          result.push([upper, lower]);
        }
      }
    }
    return result;
  }


  public getInputJsonString(postData: any): string {

    const postObject =  {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: postData.InputData0
    };
    const inputJson: string = JSON.stringify(postObject);
    return inputJson;
  }



}
