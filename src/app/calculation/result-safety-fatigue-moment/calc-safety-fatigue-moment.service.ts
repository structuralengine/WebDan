import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueMomentService {
  // 安全性（疲労破壊）曲げモーメント
  public DesignForceList: any[];
  public DesignForceList1: any[];
  // 永久作用と縁応力検討用のポストデータの数を調べるのに使う
  private PostedData: any; 

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return new Array();
    }
    // 最小応力
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[2]);
    // 最大応力
    this.DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[3]);

    const result: any[] = new Array();
    if (this.save.isManual() === true) {
      // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
      return result;
    }
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    if (this.save.calc.print_selected.print_section_force_checked === false) {
      return result;
    }
    if (isPrintOut === false) {
      return result;
    }
    // ToDo: ここで、断面力テーブル用のデータを 変数 result に構築する

    return result;
  }

  // サーバー POST用データを生成する
  public getPostData(): any {

    // 断面力のエラーチェック
    this.setDesignForces(false);

    // サーバーに送信するデータを作成
    const DesignForceListList = [this.DesignForceList, this.DesignForceList1];
    this.post.setPostData(DesignForceListList);
    this.PostedData = this.post.getPostData(this.DesignForceList, 1, 'Moment', '応力度', DesignForceListList.length);
    // 連結する
    const postData = {
      InputData0: this.PostedData.InputData.concat(this.PostedData.InputData0)
    };
    return postData;
  }

}
