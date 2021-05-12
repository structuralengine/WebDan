import { Injectable } from '@angular/core';
import { InputCalclationPrintService } from '../components/calculation-print/calculation-print.service';
import { InputDesignPointsService } from '../components/design-points/design-points.service';
import { InputSectionForcesService } from '../components/section-forces/section-forces.service';
import { DataHelperModule } from '../providers/data-helper.module';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class SetDesignForceService {


  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule,
    private points: InputDesignPointsService,
    private force: InputSectionForcesService,
    private calc: InputCalclationPrintService) {
  }

  // 断面力一覧を取得 ////////////////////////////////////////////////////////////////
  public getDesignForceList(calcTarget: string[], pickupNo: number): any[] {

    if (this.helper.toNumber(pickupNo) === null) {
      return new Array();
    }
    let result: any[];
    if (this.save.isManual() === true) {
      result = this.getDesignForceFromManualInput(calcTarget, pickupNo);
    } else {
      result = this.getDesignForceFromPickUpData(calcTarget, pickupNo);
    }

    return result;
  }

  // 断面力手入力情報から断面力一覧を取得
  private getDesignForceFromManualInput(calcTarget: string[], pickupNo: number): any[] {

    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(calcTarget[0]);

    // 断面力を取得
    const target = calcTarget[0];
    let force: any[];
    switch (target) {
      case 'Md': // 曲げモーメントの照査の場合
        force = JSON.parse(
          JSON.stringify({
            temp: this.force.moment_force
          })
        ).temp;
        break;
      case 'Vd': // せん断力の照査の場合
        force = JSON.parse(
          JSON.stringify({
            temp: this.force.shear_force
          })
        ).temp;
        break;
    }

    if (force === undefined) {
      return new Array(); // 断面力がない
    }

    // 断面力を追加
    for (const groupe of result) {
      for (const member of groupe) {
        const targetMember = force.find((value) => {
          return (value.m_no === member.m_no);
        });
        if (targetMember === undefined) {
          return new Array(); // 存在しない要素番号がある
        }
        // 奥行き本数
        let n: number = this.helper.toNumber(member.n);
        if (n === null) { n = 1; }
        if (n === 0) { n = 1; }

        for (const position of member.positions) {

          if (targetMember.case.length < pickupNo) {
            return new Array(); // ピックアップ番号の入力が不正
          }

          const targetForce = targetMember.case[pickupNo];


          for (const key of Object.keys(targetForce)) {
            let value: number = this.helper.toNumber(targetForce[key]);
            if (value === null) { value = 0; }
            targetForce[key] = value;
          }

          const designForce = this.getSectionForce(
            target, n, {
            Mdmax: targetForce,
            Mdmin: targetForce,
            Vdmax: targetForce,
            Vdmin: targetForce,
            Ndmax: targetForce,
            Ndmin: targetForce,
          });
          designForce['n'] = n;

          position['designForce'] = designForce;
        }
      }
    }

    return result;
  }

  // ピックアップデータから断面力一覧を取得
  private getDesignForceFromPickUpData(calcTarget: string[], pickupNo: number): any[] {

    const target = calcTarget[0];
    // 部材グループ・照査する着目点を取得
    const result = this.getEnableMembers(target);

    // 断面力を取得
    const force: object = this.save.getPickUpData();

    // 断面力を追加
    const pickupStr: string = pickupNo.toString();
    if (pickupStr in force === false) {
      return new Array(); // ピックアップ番号の入力が不正
    }
    const targetForce = force[pickupStr];

    // 断面力を追加
    for (const groupe of result) {
      for (const member of groupe) {
        const targetMember = targetForce.filter((value) =>
          value.m_no === member.m_no);
        if (targetMember === undefined) {
          return new Array(); // 存在しない要素番号がある
        }
        // 奥行き本数
        let n: number = this.helper.toNumber(member.n);
        if (n === null) { n = 1; }
        n = (n === 0) ? 1 : Math.abs(n);

        for (const position of member.positions) {

          const targetPosition = targetMember.find((value) =>
            value.index === position.index);

          if (targetPosition === undefined) {
            return new Array(); // 存在しない着目点がある
          }


          let temp: any;
          if (!('my' in targetPosition)) {
            // 2次元PICKUP
            temp = this.getSectionForce(calcTarget, n, {                     
              Mdmax: targetPosition['M'].max,
              Mdmin: targetPosition['M'].min,
              Vdmax: targetPosition['S'].max,
              Vdmin: targetPosition['S'].min,
              Ndmax: targetPosition['N'].max,
              Ndmin: targetPosition['N'].min
            }) 

          } else {
            let mKey1 = 'my', mKey2 = 'Mdy', vKey1 = 'fy', vKey2 = 'Vdy';
            if ((target === 'Md' && position.isMzCalc === true) ||
                (target === 'Vd' && position.isVzCalc === true)) {
              mKey1 = 'mz', mKey2 = 'Mdz', vKey1 = 'fz', vKey2 = 'Vdz';
            } 

            const forceObj = {};
            const k1 = [mKey1, vKey1, 'fx'];
            const k2 = ['Md', 'Vd', 'Nd'];
            for(let i=0; i<3; i++){
              for(const k3 of ['max', 'min']){
                const t = targetPosition[k1[i]];
                const m1 = t[k3];
                const k4 = k2[i] + k3;
                forceObj[k4] = {      
                  Md: m1[mKey2],
                  Vd: m1[vKey2],
                  Nd: m1.Nd,
                  comb: m1.comb
                }
              }
            }
            temp = this.getSectionForce(calcTarget, n, forceObj);
          }

          position['designForce'] = temp;
        }
      }
    }

    return result;
  }

  // 計算対象の着目点のみを抽出する
  private getEnableMembers(target: string): any[] {

    const result = this.points.getGroupeList();

    // 計算対象ではない着目点を削除する
    for (let i = result.length - 1; i >= 0; i--) {
      // 計算・印刷画面の部材にチェックが入っていなかければ削除
      if (this.calc.calc_checked[i] === false) {
        result.splice(i, 1);
        continue;
      }
      const members = result[i];

      for (let j = members.length - 1; j >= 0; j--) {
        let maxFlag: boolean = false;
        const positions = members[j].positions;

        for (const pos of positions) {
          if (maxFlag === true) {
            pos['enable'] = maxFlag;
          } else {
            switch (target) {
              case 'Md':  // 曲げモーメントの照査の場合
                pos['enable'] = (pos.isMyCalc === true || pos.isMzCalc === true);
                break;
              case 'Vd': // せん断力の照査の場合
                pos['enable'] = (pos.isVyCalc === true || pos.isVzCalc === true);
                break;
            }
          }

          const p_name: string = (pos.p_name === null) ? '' : pos.p_name.toString().toUpperCase();

          if (pos.enable === true && p_name.indexOf('MAX') >= 0) {
            // 着目点名(p_name) に MAX というキーワードが入っていたら END まで対象とする
            maxFlag = true;
          }

          pos['isMax'] = maxFlag;  // MAX 区間中は isMaxフラグを付ける

          if (p_name.indexOf('END') >= 0) {
            maxFlag = false;
          }


        }

        // 不要なポジションを削除する
        for (let k = positions.length - 1; k >= 0; k--) {
          if (positions[k].enable === false) {
            positions.splice(k, 1);
          } else {
            delete positions[k].enable;
          }
        }

        // 照査する着目点がなければ 対象部材を削除
        if (positions.length === 0) {
          members.splice(j, 1);
        }

      }

      // 照査する部材がなければ 対象グループを削除
      if (members.length === 0) {
        result.splice(i, 1);
      }

    }

    return result;
  }

  // 複数の断面力表について、基本の断面力に無いものは削除する
  public AlignMultipleLists(...DesignForceListList: any[]) {

    const baseDesignForceList: any[] = DesignForceListList[0];

    for (let i = 1; i < DesignForceListList.length; i++) {

      // 全ての着目点情報を収集しておく
      const targetPositions = [];
      for (const g of DesignForceListList[i]) {
        for (const m of g) {
          for (const p of m.positions) {
            targetPositions.push(p);
          }
        }
      }

      // ベースケースの複製を作っておく
      const targetDesignForceList = JSON.parse(
        JSON.stringify({ temp: baseDesignForceList })
      ).temp;

      ////////////////////////////////////////////////////////////////
      for (let ig = 0; ig < baseDesignForceList.length; ig++) {
        const groupe = baseDesignForceList[ig];
        for (let im = 0; im < groupe.length; im++) {
          const member = groupe[im];
          for (let ip = 0; ip < member.positions.length; ip++) {
            const position = member.positions[ip];
            const index = position.index;

            // 同じindex の position を見つける ///////////////////////
            const targetPosition: any = targetPositions.find(p => p.index === index);
            const p = targetDesignForceList[ig][im].positions[ip];

            for(const def of p.designForce){
              const targetSide: any = targetPosition.designForce.find(d => d.side === def.side);
              if (targetPosition !== undefined) {
                
              }
            }

            
            if (targetPosition !== undefined) {
              // 断面力情報をコピー
              p.designForce = targetPosition.designForce;

            } else {
              // 断面力情報が見つからなかった
              const def = { comb: 0, Md: 0, Nd: 0, Vd: 0 };
              p.designForce = {
                Mdmax: def, Mdmin: def,
                Vdmax: def, Vdmin: def,
                Ndmax: def, Ndmin: def,
                n: 1
              };
            }

          }
        }
      }

      DesignForceListList[i] = targetDesignForceList;

    }

  }


  // 設計断面力（リスト）を生成する
  private getSectionForce(calcTarget: string[], n: number, forceObj: any): any[] {

    // 設計断面の数をセット
    const result: any[] = new Array();

    for (const target of calcTarget) {

      let maxKey: string = target + 'max';
      let minKey: string = target + 'min';

      if (!(maxKey in forceObj) && !(minKey in forceObj)) { return result; }
      if (!(maxKey in forceObj)) { maxKey = minKey; }
      if (!(minKey in forceObj)) { minKey = maxKey; }

      // 最大の場合と最小の場合登録する
      for (const k of [maxKey, minKey]) {
        const force = forceObj[k];
        const side = (force.Md > 0) ? '下側引張' : '上側引張';
        const f = {
          side, target,
          Md: force.Md / n,
          Vd: force.Vd / n,
          Nd: force.Nd / n,
          comb: force.comb
        };
        // -------------------------------------------
        let flg = false;
        for (let i = 0; i < result.length; i++) {
          const r = result[i];
          if (r.side === side && r.target === target) {
            flg = true;
            // side が同じ場合値の大きい方を採用する
            if (Math.abs(r[target]) < Math.abs(f[target])) {
              result[i] = f;
            }
          }
        }
        if (flg === false) {
          result.push(f);
        }
        // -------------------------------------------
      }
    }
    return result;
  }


}
