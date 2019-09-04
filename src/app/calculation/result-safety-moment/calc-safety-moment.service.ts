import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetSectionService } from '../set-section.service';
import { SetSafetyFactorService } from '../set-safety-factor.service';

import { ResultDataService } from '../result-data.service';
import { UserInfoService } from '../../providers/user-info.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyMomentService {
  // 安全性（破壊）曲げモーメント
  public DesignForceList: any[];

  constructor(
    private save: SaveDataService,
    private user: UserInfoService,
    private force: SetDesignForceService,
    private sectin: SetSectionService,
    private safety: SetSafetyFactorService,
    private result: ResultDataService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      this.DesignForceList = new Array();
      return new Array();
    }

    const pickupNoList: any[] = new Array();
    pickupNoList.push(this.save.basic.pickup_moment_no[7]); // ピックアップNoは 曲げの7番目に保存されている
    this.DesignForceList = this.force.getDesignForceList('Moment', pickupNoList);

    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    if (this.save.calc.print_selected.print_section_force_checked === false) {
      return result;
    }

    // ToDo: ここで、断面力テーブル用のデータを 変数 result に構築する

    return result;
  }

  // サーバー POST用データを生成する
  public getPostData(): any {

    // 断面力のエラーチェック
    if (this.DesignForceList === null) {
      this.setDesignForces();
    }
    if (this.DesignForceList.length < 1) {
      this.setDesignForces();
      if (this.DesignForceList.length < 1) {
        // Error!! - 計算対象がありません
        return null;
      }
    }

    // サーバーに送信するデータを作成
    const postData = this.setPostData(this.DesignForceList);
    return postData;
  }

  // サーバーに送信するデータを作成
  public setPostData(DesignForceList: any[], calcTarget: string = 'Moment'): any {
    const result = {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: new Array()
    };

    for (const groupe of DesignForceList) {
      for (const member of groupe) {
        for (const position of member.positions) {
          for(const force of position.designForce) {
            const temp1: any[] = this.getSectionForce(force);
            if ('PostData' in position) {
              const temp2: any[] = position.PostData.concat(temp1);
              position.PostData = temp2;
            } else {
              position['PostData'] = temp1;
            }
             // 安全係数を position['safety_factor'], position['material_steel']
             // position['material_concrete'], position['pile_factor'] に登録する
            this.safety.setSafetyFactor(calcTarget, member.g_no, position, 2);
            // 鉄筋の本数・断面形状を position['PostData'] に登録
            // 出力用の string を position['printData'] に登録
            this.sectin.setPostData(member.g_no, member.m_no, position);
            // 変数に登録
            for (const section of position.PostData) {
              delete section.Md;  // 設計断面力データ Md の入力がない場合、断面の耐力を計算します。
              result.InputData.push(section);
            }
          }
        }
      }
    }
    return result;
  }

  // 設計断面力（リスト）を生成する
  public getSectionForce(forceList: any): any[] {

    // 設計断面の数をセット
    let result: any[];

    if ('Manual' in forceList) {
      // 断面手入力モードの場合は 設計断面 1つ
      const side = (forceList.Manual.Md > 0) ? '下側引張' : '上側引張';
      result = [{
        memo: side,
        Md: forceList.Manual.Md / forceList.n,
        Vd: forceList.Manual.Vd / forceList.n,
        Nd: forceList.Manual.Nd / forceList.n
      }];

    } else if (Math.sign(forceList.Mmax.Md) === Math.sign(forceList.Mmin.Md)) {
      // Mmax, Mmin の符号が同じなら 設計断面 1つ
      const side = (forceList.Mmax.Md > 0) ? '下側引張' : '上側引張';
      const force = (Math.abs(forceList.Mmax.Md) > Math.abs(forceList.Mmin.Md)) ? forceList.Mmax : forceList.Mmin;
      result = [{
        memo: side,
        Md: force.Md / forceList.n,
        Vd: force.Vd / forceList.n,
        Nd: force.Nd / forceList.n
      }];
    } else {
      // Mmax, Mmin の符号が異なるなら 設計断面 2つ
      result = [{
        memo: '上側引張',
        Md: forceList.Mmin.Md / forceList.n,
        Vd: forceList.Mmin.Vd / forceList.n,
        Nd: forceList.Mmin.Nd / forceList.n
      }, {
        memo: '下側引張',
        Md: forceList.Mmax.Md / forceList.n,
        Vd: forceList.Mmax.Vd / forceList.n,
        Nd: forceList.Mmax.Nd / forceList.n
      }];
    }

    return result;
  }

}

