import { SaveDataService } from '../../providers/save-data.service';
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
    private calc: ResultDataService) {
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
    this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);

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
  public setPostData(DesignForceList: any[]): any {
    const postData = {
      username: this.user.loginUserName,
      password: this.user.loginPassword,
      InputData: new Array()
    };

    for (const groupe of DesignForceList) {
      for (const member of groupe) {
        for (const position of member.positions) {
          for (let i = 0; i < position.designForce.length; i++) {
            const temp1: any[] = this.getSectionForce(position.designForce[i]);
            if ('PostData' in position) {
              const temp2: any[] = position.PostData.concat(temp1);
              position.PostData = temp2;
            } else {
              position['PostData'] = temp1;
            }
            for (const section of position.PostData) {
              this.calc.setSafetyFactor('Moment', member.g_no, position, 0); // 安全係数を代入する
              this.calc.setPostData(member.g_no, member.m_no, position); // 鉄筋の本数・断面形状を入力する
              delete section.Md;  // 設計断面力データ Md の入力がない場合、断面の耐力を計算します。
              postData.InputData.push(section);
            }
          }
        }
      }
    }
    return postData;
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

  // 出力テーブル用の配列にセット
  public setSafetyPages(responseData: any, postData: any): any[] {
    const result: any[] = new Array();
    let page: any = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };

    for (const groupe of postData) {
      for (const member of groupe) {
        for (const position of member.positions) {
          for (const postdata of position.PostData) {
            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };
            }
            const column: any[] = new Array();
            /////////////// タイトル ///////////////
            column.push(this.calc.getTitleString1(member, position) );
            column.push(this.calc.getTitleString2(position, postdata));
            column.push(this.calc.getTitleString3(position));
            ///////////////// 形状 /////////////////
            column.push(this.calc.getShapeString_B(position.memberInfo, postdata));
            column.push(this.calc.getShapeString_H(position.memberInfo, postdata));
            column.push(this.calc.getShapeString_Bt(position.memberInfo, postdata));
            column.push(this.calc.getShapeString_t(position.memberInfo, postdata));
            /////////////// 引張鉄筋 ///////////////
            const Ast: any = this.calc.getAsStringList(position.barData.rebar1, postdata.SteelElastic[0]);
            column.push(Ast.As);
            column.push(Ast.AsString);
            column.push(Ast.dt);
            /////////////// 圧縮鉄筋 ///////////////
            const Asc: any = this.calc.getAsStringList(position.barData.rebar2, postdata.SteelElastic[0]);
            column.push(Asc.As);
            column.push(Asc.AsString);
            column.push(Asc.dt);
            /////////////// 側面鉄筋 ///////////////
            column.push({ alien: 'center', value: '-' });
            column.push({ alien: 'center', value: '' });
            column.push({ alien: 'center', value: '-' });
            /////////////// コンクリート情報 ///////////////
            column.push({ alien: 'right', value: '24.0' });
            column.push({ alien: 'right', value: '1.30' });
            column.push({ alien: 'right', value: '18.5' });
            /////////////// 鉄筋情報 ///////////////
            column.push({ alien: 'right', value: '390' });
            column.push({ alien: 'right', value: '1.00' });
            column.push({ alien: 'right', value: '390' });
            /////////////// 断面力 ///////////////
            column.push({ alien: 'right', value: '501.7' });
            column.push({ alien: 'right', value: '455.2' });
            /////////////// 照査 ///////////////
            column.push({ alien: 'right', value: '0.00350' });
            column.push({ alien: 'right', value: '0.02168' });
            column.push({ alien: 'right', value: '572.1' });
            column.push({ alien: 'right', value: '7420.2' });
            column.push({ alien: 'right', value: '1.00' });
            column.push({ alien: 'right', value: '7420.2' });
            column.push({ alien: 'right', value: '1.20' });
            column.push({ alien: 'right', value: '0.081' });
            column.push({ alien: 'center', value: 'OK' });
            page.columns.push(column);
          }
        }
      }
      if (page.columns.length > 0) {
        result.push(page);
        page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };
      }
    }
    return result;
  }

}

