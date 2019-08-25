import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyMomentService {
  // 安全性（破壊）曲げモーメント
  private DesignForceList: any[];

  constructor(private save: SaveDataService,
    private calc: ResultDataService) { }

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

  public getSafetyPages(): any[] {

    // 断面力のエラーチェック
    if (this.DesignForceList.length === null) {
      return new Array();
    }
    if (this.DesignForceList.length < 1) {
      return new Array();
    }

    // 断面照査するための情報を収集
    for (let gi = 0; gi < this.DesignForceList.length; gi++) {
      const groupe = this.DesignForceList[gi];
      for (const member of groupe) {
        for (const position of member.positions) {
          position['SectionData'] = this.getSectionForce(position.designForce[0]);
          for (const section of position['SectionData']) {
            // 安全係数を代入する
            this.calc.setSafetyFactor(member.g_no, position, 2);
            // 鉄筋の本数・断面形状を入力する
            this.calc.setSectionData(member.m_no, position);
            // 鉄筋の本数・断面形状を入力する
            this.calc.setBars(member.g_no, member.m_no, position);

          }
        }
      }
    }

    // サーバーに送信するデータを作成

    // サーバーに送信する

    // サーバーが計算した情報を集計する

    // 出力テーブル用の配列にセット
    const result: any[] = this.setSafetyPages();
    return result;
  }


  // 設計断面力（リスト）を生成する
  public getSectionForce(forceList: any): any[] {

    // 設計断面の数をセット
    let SectionData: any[];

    if ('Manual' in forceList) {
      // 断面手入力モードの場合は 設計断面 1つ
      const side = (forceList.Manual.Md > 0) ? '下側引張' : '上側引張';
      SectionData = [{
        memo: side,
        Md: forceList.Manual.Md,
        Nd: forceList.Manual.Nd,
      }];

    } else if (Math.sign(forceList.Mmax.Md) === Math.sign(forceList.Mmin.Md)) {
      // Mmax, Mmin の符号が同じなら 設計断面 1つ
      const side = (forceList.Mmax.Md > 0) ? '下側引張' : '上側引張';
      const force = (Math.abs(forceList.Mmax.Md) > Math.abs(forceList.Mmin.Md)) ? forceList.Mmax : forceList.Mmin;
      SectionData = [{
        memo: side,
        Md: force.Md,
        Nd: force.Nd,
      }];
    } else {
      // Mmax, Mmin の符号が異なるなら 設計断面 2つ
      SectionData = [{
        memo: '上側引張',
        Md: forceList.Mmin.Md,
        Nd: forceList.Mmin.Nd,
      }, {
        memo: '下側引張',
        Md: forceList.Mmax.Md,
        Nd: forceList.Mmax.Nd,
      }];
    }
    return SectionData;
  }

  // 出力テーブル用の配列にセット
  private setSafetyPages(): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });
        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });
        column.push({ alien: 'right', value: '12707.2' });
        column.push({ alien: 'center', value: 'D32-16 本' });
        column.push({ alien: 'right', value: '114.0' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
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
      result.push(page);
    }

    return result;
  }

}

