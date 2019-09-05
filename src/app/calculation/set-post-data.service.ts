import { Injectable } from '@angular/core';

import { UserInfoService } from '../providers/user-info.service';
import { SetSectionService } from './set-section.service';
import { SetSafetyFactorService } from './set-safety-factor.service';


@Injectable({
  providedIn: 'root'
})
export class SetPostDataService {

  constructor(private user: UserInfoService,
    private section: SetSectionService,
    private safety: SetSafetyFactorService) { }

  // 計算(POST)するときのヘルパー ///////////////////////////////////////////////////////////////////////////
  public URL: string = 'http://structuralengine.com/RCnonlinear/api/values/';

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
  public getPostData(
    DesignForceList: any[],
    SafetyFactorINdex: number,
    calcTarget: string,
    calcMode: string = '耐力'
  ): any {

    const result = {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: new Array()
    };

    for (const groupe of DesignForceList) {
      for (const member of groupe) {
        for (const position of member.positions) {
          // 安全係数を position['safety_factor'], position['material_steel']
          // position['material_concrete'], position['pile_factor'] に登録する
          this.safety.setSafetyFactor(calcTarget, member.g_no, position, SafetyFactorINdex);
          // 鉄筋の本数・断面形状を position['PostData'] に登録
          // 出力用の string を position['printData'] に登録
          this.section.setPostData(member.g_no, member.m_no, position);
          // 変数に登録
          switch (calcMode) {
            case '耐力':
              for (const section of position.PostData) {
                delete section.Md;  // 設計断面力データ Md の入力がない場合、断面の耐力を計算します。
                result.InputData.push(section);
              }
              break;
            case '応力度':
              let id = 0;
              let key1: string = 'PostData';
              let key2: string = 'InputData';
              while (key1 in position) {
                if (key2 in result === false) {
                  result[key2] = new Array();
                }
                for (let i = 0; i < position[key1].length; i++) {
                  const section: any = position[key1][i];
                  section.Md = Math.abs(section.Md);
                  if (id > 0) {
                    section['Sections'] = position.PostData[i].Sections;
                    section['SectionElastic'] = position.PostData[i].SectionElastic;
                    section['Steels'] = position.PostData[i].Steels;
                    section['SteelElastic'] = position.PostData[i].SteelElastic;
                  }
                  result[key2].push(section);
                }
                key1 = 'PostData' + id.toString();
                key2 = 'InputData' + id.toString();
                id++;
              }
              break;
          }
        }
      }
    }
    return result;
  }

  // position に PostData を追加する
  // DesignForceList　を複数指定できる。最初の DesignForceList が基準になる
  public setPostData(DesignForceListList: any[]): void {

    const baseDesignForceList: any[] = DesignForceListList[0];

    for (let ig = 0; ig < baseDesignForceList.length; ig++) {
      const groupe = baseDesignForceList[ig];
      for (let im = 0; im < groupe.length; im++) {
        const member = groupe[im];
        for (let ip = 0; ip < member.positions.length; ip++) {
          const position = member.positions[ip];
          for (let fo = 0; fo < position.designForce.length; fo++) {
            const force: any[] = new Array();

            // 対象の断面力を抽出する
            for (const target of DesignForceListList) {
              let f: any;
              try {
                f = target[ig][im].positions[ip].designForce[fo];
              } catch{
                f = null;
              }
              force.push(f);
            }

            // ピックアップ断面力から設計断面力を選定する
            const temp0: any[] = this.getSectionForce(force);

            // postData に登録する
            let id: string = '';
            for (let it = 0; it < temp0.length; it++) {
              const temp1 = temp0[it];
              const key: string = 'PostData' + id;
              if (key in position) {
                const temp2: any[] = position.PostData.concat(temp1);
                position.PostData = temp2;
              } else {
                position[key] = temp1;
              }
              id = it.toString();
            }

          }
        }
      }
    }
  }

  // 設計断面力（リスト）を生成する
  private getSectionForce(forceListList: any[]): any[] {

    // 設計断面の数をセット
    let result: any[] = new Array();

    if ('Manual' in forceListList[0]) {
      // 断面手入力モードの場合は 設計断面 1つ
      const side = (forceListList[0].Manual.Md > 0) ? '下側引張' : '上側引張';
      for (const forceList of forceListList) {
        if (forceList === null) {
          result.push([{
            memo: side,
            Md: 0,
            Vd: 0,
            Nd: 0
          }]);
        } else {
          result.push([{
            memo: side,
            Md: forceList.Manual.Md / forceList.n,
            Vd: forceList.Manual.Vd / forceList.n,
            Nd: forceList.Manual.Nd / forceList.n
          }]);

        }
      }

    } else if (Math.sign(forceListList[0].Mmax.Md) === Math.sign(forceListList[0].Mmin.Md)) {
      // Mmax, Mmin の符号が同じなら 設計断面 1つ
      const side = (forceListList[0].Mmax.Md > 0) ? '下側引張' : '上側引張';
      const key: string = (Math.abs(forceListList[0].Mmax.Md) > Math.abs(forceListList[0].Mmin.Md)) ? 'Mmax' : 'Mmin';
      for (const forceList of forceListList) {
        if (forceList === null) {
          result.push([{
            memo: side,
            Md: 0,
            Vd: 0,
            Nd: 0
          }]);
        } else {
          const force = forceList[key];
          result.push([{
            memo: side,
            Md: force.Md / forceList.n,
            Vd: force.Vd / forceList.n,
            Nd: force.Nd / forceList.n
          }]);
        }
      }
    } else {
      // Mmax, Mmin の符号が異なるなら 設計断面 2つ
      for (const forceList of forceListList) {
        if (forceList === null) {
          result.push([{
            memo: '上側引張',
            Md: 0,
            Vd: 0,
            Nd: 0
          }, {
            memo: '下側引張',
            Md: 0,
            Vd: 0,
            Nd: 0
          }]);
        }
        else {
          result.push([{
            memo: '上側引張',
            Md: forceList.Mmin.Md / forceList.n,
            Vd: forceList.Mmin.Vd / forceList.n,
            Nd: forceList.Mmin.Nd / forceList.n
          }, {
            memo: '下側引張',
            Md: forceList.Mmax.Md / forceList.n,
            Vd: forceList.Mmax.Vd / forceList.n,
            Nd: forceList.Mmax.Nd / forceList.n
          }]);
        }
      }
    }

    return result;
  }

}
