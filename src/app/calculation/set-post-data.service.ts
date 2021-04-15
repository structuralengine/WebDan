import { Injectable } from '@angular/core';

import { UserInfoService } from '../providers/user-info.service';
import { SaveDataService } from '../providers/save-data.service';
import { SetSectionService } from './set-section.service';
import { SetSafetyFactorService } from './set-safety-factor.service';
import { DataHelperModule } from '../providers/data-helper.module';


@Injectable({
  providedIn: 'root'
})
export class SetPostDataService {

  constructor(private user: UserInfoService,
              private save: SaveDataService,
              private helper: DataHelperModule,
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
          if (position.PostData0 === undefined) {
            continue;
          }
          // 安全係数を position['safety_factor'], position['material_steel']
          // position['material_concrete'], position['pile_factor'] に登録する
          this.safety.setSafetyFactor(calcTarget, member.g_id, position, SafetyFactorIndex);

          // 鉄筋の本数・断面形状を position['PostData'] に登録
          // 出力用の string を position['PrintData'] に登録
          this.section.setPostData(member.g_id, member.m_no, position);

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
        const memberInfo = this.save.members.member_list.find( (value) => {
          return (value.m_no === member.m_no);
        });
        if (memberInfo === undefined) {
          console.log('部材番号が存在しない');
          continue;
        }

        for (let ip = 0; ip < member.positions.length; ip++) {
          const position = member.positions[ip];
          if (position === undefined) {
            console.log('着目点が存在しない');
            continue;
          }
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
            sectionForce = this.getSectionForce(force, member.g_id, calcTarget);

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

    // MAX区間(isMax) の断面力のうち最大のものを一つ選ぶ
    this.setMaxPosition(DesignForceListList, calcTarget);

    // Md=0 のケースを削除する
    this.deleteEmptyForce(DesignForceListList, calcTarget);

  }

  private  deleteEmptyForce(DesignForceListList: any[], calcTarget: string): void {

    const baseDesignForceList = DesignForceListList[0];

    // Md=0 のケースを削除する
    for (let i = baseDesignForceList.length - 1; i >= 0; i--) {
      for (let j = baseDesignForceList[i].length - 1; j >= 0; j--) {
        const df = baseDesignForceList[i][j];
        for (let k = df.positions.length - 1; k >= 0; k--) {
          const ps = df.positions[k];
          if (ps === undefined) {
            df.positions.splice(k, 1);
            continue;
          }   
          if (!('PostData0' in ps)) {
            df.positions.splice(k, 1);
            continue;
          }
          const pd = ps['PostData0'][0];
          if (pd[calcTarget] === 0) {
            df.positions.splice(k, 1);
          }
        }
        if (df.positions.length === 0) {
          for( const dl of DesignForceListList){
            dl[i].splice(j, 1);
          }
        }
      }
      if (baseDesignForceList.length === 0) {
        for( const dl of DesignForceListList){
          dl.splice(i, 1);
        }
      }
    }
  }


  // MAX区間(isMax) の着目点一覧を取得する
  public getMaxPositionList(baseDesignForceList: any[], calcTarget: string): any {

    // maxグループの部材リストを作成する
    const maxIndexList = {};
    for (let ig = 0; ig < baseDesignForceList.length; ig++) {
      const groupe = baseDesignForceList[ig];
      let mIList: any[] = new Array();
      let flg: boolean = false;
      for (let im = 0; im < groupe.length; im++) {
        for (let ip = 0; ip < groupe[im].positions.length; ip++) {
          const position = groupe[im].positions[ip];
          if ( position.isMax === true) {
            mIList.push({im, ip});
            flg = true;
          } else if ( flg === true ) {
            flg = false;
            if ( !(ig in maxIndexList)) {
              maxIndexList[ig] = new Array();
            }
            maxIndexList[ig].push(mIList);
            mIList = new Array();
          }
        }
      }
      // flg が trueのままだったら 追加して終わる
      if ( flg === true ) {
        if ( !(ig in maxIndexList)) {
          maxIndexList[ig] = new Array();
        }
        maxIndexList[ig].push(mIList);
      }
    }

    // maxグループの部材リストの中で最も大きい断面力を持つ行を選ぶ
    const maxPositionList = {};
    for (const ig of Object.keys(maxIndexList)) {
      for (const list of maxIndexList[ig]) {

        let upper: any = null;
        let bottom: any = null;

        let keys = list[0];
        let member = baseDesignForceList[ig][keys.im];
        let position = member.positions[keys.ip];
        const name: string = position.p_name_ex;

        for ( keys of list) {
          member = baseDesignForceList[ig][keys.im];
          position = member.positions[keys.ip];

          // グループid に "P" が含まれていたら Max Min の大きい方だけを計算する
          const g_id_Mode_P: boolean = (member.g_id.toUpperCase().indexOf('P') >= 0) ? true : false;

          for ( const force of position.PostData0) {
            switch (force.memo) {
              case '上側引張':
                if ( upper === null ) {
                  upper = position;
                  upper['keyForce'] = force;
                  upper.p_name_ex = name;
                } else if (calcTarget === 'Md') {
                  if (upper.keyForce[calcTarget] > force[calcTarget]) {
                    upper = position;
                    upper.keyForce = force;
                    upper.p_name_ex = name;
                  }
                } else {
                  if (Math.abs(upper.keyForce[calcTarget]) < Math.abs(force[calcTarget])) {
                    upper = position;
                    upper.keyForce = force;
                    upper.p_name_ex = name;
                  }
                }
                break;
              default: // '下側引張':
              if ( bottom === null ) {
                bottom = position;
                bottom['keyForce'] = force;
                bottom.p_name_ex = name;
              } else if (calcTarget === 'Md') {
                if (bottom.keyForce[calcTarget] < force[calcTarget]) {
                  bottom = position;
                  bottom.keyForce = force;
                  bottom.p_name_ex = name;
                }
              } else {
                if (Math.abs(bottom.keyForce[calcTarget]) < Math.abs(force[calcTarget])) {
                  bottom = position;
                  bottom.keyForce = force;
                  bottom.p_name_ex = name;
                }
              }
              break;
            }

            if (upper === null) {
              upper = this.copy(bottom);
            } else if (bottom === null) {
              bottom = this.copy(upper);
            }

            // グループid に "P" が含まれていたら Max Min の大きい方だけを計算する
            if ( g_id_Mode_P ===  true) {
              const u = Math.abs(upper.PostData0[calcTarget]);
              const b = Math.abs(bottom.PostData0[calcTarget]);
              if ( b === u ) {
                // pass
              } else if (b < u) {
                upper = this.copy(bottom);
              } else {
                bottom = this.copy(upper);
              }
            }

            // upper の下側引張　を削除する
            let i = 0;
            let key: string = 'PostData' + i.toString();
            while (key in upper) {
              const p = upper[key];
              for (let j = p.length - 1; j >= 0; j--) {
                if ( p[j].memo === '下側引張' ) {
                  p.splice(j, 1);
                }
              }
              i++;
              key = 'PostData' + i.toString();
            }

            // bottom の上側引張　を削除する
            i = 0;
            key = 'PostData' + i.toString();
            while (key in bottom) {
              const p = bottom[key];
              for (let j = p.length - 1; j >= 0; j--) {
                if ( p[j].memo === '上側引張' ) {
                  p.splice(j, 1);
                }
              }
              i++;
              key = 'PostData' + i.toString();
            }
            if (upper.PostData0.length === 0) {
              upper = bottom;
            }
            if (bottom.PostData0.length === 0) {
              bottom = upper;
            }
          }
        }
        if ( !(ig in maxPositionList)) {
          maxPositionList[ig] = new Array();
        }
        maxPositionList[ig].push({upper, bottom});
      }
    }

    return maxPositionList;

  }

  // MAX区間(isMax) の断面力のうち最大のものを一つ選ぶ
  private setMaxPosition(DesignForceListList: any[], calcTarget: string): void {

    // MAX区間(isMax) の着目点一覧を取得する
    const maxPositionList = this.getMaxPositionList(DesignForceListList[0], calcTarget);

    // isMax フラグの付いた部材のうち最大でない部材を除外する
    const results: any[] = new Array(DesignForceListList.length).fill(new Array());

    for (let ig = 0; ig < DesignForceListList[0].length; ig++) {
      const groupe = DesignForceListList[0][ig];

      const tempgs: any[] = new Array(DesignForceListList.length).fill(new Array());
      for (let im = 0; im < groupe.length; im++) {

        const members: any[] = new Array();
        for (const df of DesignForceListList){
          members.push(df[ig][im]);
        }       

        const tempms: any[] = new Array(DesignForceListList.length).fill(new Array());
        for(let i=0; i< members.length; i++){
          for (let ip = 0; ip < members[0].positions.length; ip++) {
          const position = members[i].positions[ip];

          if ( position.isMax === true) {
            for ( const boj of maxPositionList[ig]) {
              if (position.index === boj.upper.index) {
                tempms[i].push(position);
              }
              if ( boj.upper.index !== boj.bottom.index) {
                if (position.index === boj.bottom.index) {
                  tempms[i].push(position);
                }
              }
            }
          } else {
            tempms[i].push(position);
          }
        }
        }
        if (tempms[0].length > 0 ) {
          for (let i = 0; i < DesignForceListList.length; i++){
            members[i].positions = tempms[i];
            tempgs[i].push(members[i]);
          }
        }
      }
      if (tempgs[0].length > 0 ) {
        for (let i = 0; i < DesignForceListList.length; i++){
          results[i].push(tempgs[i]);
        }
      }
    }

    for (let i = 0; i < DesignForceListList.length; i++){
      DesignForceListList[i] = results[i];
    }

  }

  // 設計断面力（リスト）を生成する
  public getSectionForce(forceListList: any[], g_id: string, calcTarget: string): any[] {

    // 設計断面の数をセット
    const result: any[] = new Array();

    if ('Manual' in forceListList[0]) {

      // 断面手入力モードの場合は 設計断面 1つ
      if (forceListList[0].Manual === undefined) {
        return result;
      }
      let num = 0;
      if ('Md' in forceListList[0].Manual) {
        num = this.helper.toNumber(forceListList[0].Manual.Md);
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
          const Vd: number = this.helper.toNumber(forceList.Manual.Vd / forceList.n);
          const Md: number = this.helper.toNumber(forceList.Manual.Md / forceList.n);
          const Nd: number = this.helper.toNumber(forceList.Manual.Nd / forceList.n);
          fo = {
            memo: side,
            Md: (Md === null) ? 0: Md,
            Vd: (Vd === null) ? 0: Vd,
            Nd: (Nd === null) ? 0: Nd,
          };
        }
        result.push([fo]);
      }

    } else {
      let maxKey: string = calcTarget + 'max';
      let minKey: string = calcTarget + 'min';

      if (!(maxKey in forceListList[0])) { return result; }
      if (!(minKey in forceListList[0])) { return result; }
      let maxForce = forceListList[0][maxKey];
      let minForce = forceListList[0][minKey];

      // グループid に "P" が含まれていたら Max Min の大きい方だけを計算する
      const g_id_Mode_P: boolean = (g_id.toUpperCase().indexOf('P') >= 0) ? true : false;

      if (g_id_Mode_P === true || Math.sign(maxForce.Md) === Math.sign(minForce.Md)) {
        // Mdmax, Mdmin の符号が同じなら 設計断面 1つ

        if (maxForce[calcTarget] === minForce[calcTarget]) { // 断面力が同じで
          if (forceListList.length > 0) {                    // forceListList[1]がある場合
            if (forceListList[1] !== undefined) {
              // forceListList[1]で判定する
              if (maxKey in forceListList[1]) {
                maxForce = forceListList[1][maxKey];
              }
              if (minKey in forceListList[1]) {
                minForce = forceListList[1][minKey];
              }
            }
          }
        }

        let side: string;
        let key: string;

        if (Math.abs(maxForce[calcTarget]) > Math.abs(minForce[calcTarget])) {
          key = maxKey;
          side = (maxForce.Md > 0) ? '下側引張' : '上側引張';
        } else {
          key = minKey;
          side = (minForce.Md > 0) ? '下側引張' : '上側引張';
        }

        for (const forceList of forceListList) {
          let f: any;
          if (forceList === null) {
            f = {
              memo: side,
              Md: 0,
              Vd: 0,
              Nd: 0
            };
          } else {
            const force = forceList[key];
            f = {
              memo: side,
              Md: force.Md / forceList.n,
              Vd: force.Vd / forceList.n,
              Nd: force.Nd / forceList.n,
              comb: force.comb
            };
          }
          result.push([f]);
        }

      } else {
        // Mdmax, Mdmin の符号が異なるなら 設計断面 2つ
        for (const forceList of forceListList) {
          let upper: any;
          let lower: any;
          if (forceList === null) {
            upper = {
              memo: '上側引張',
              Md: 0,
              Vd: 0,
              Nd: 0
            };
            lower = {
              memo: '下側引張',
              Md: 0,
              Vd: 0,
              Nd: 0
            };
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

    const postObject = {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: postData.InputData0
    };
    const inputJson: string = JSON.stringify(postObject);
    return inputJson;
  }

  private copy(obj: any): any {
    const result = JSON.parse(
      JSON.stringify({
        temp: obj
      })
    ).temp;
    return result;
  }


}
