import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcRestorabilityShearForceService {
  // 復旧性（地震時以外）せん断力
  public DesignForceList: any[];

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService) {
    this.DesignForceList = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return new Array();
    }
    const DesignForce = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[6]);

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

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return null;
    }
    this.DesignForceList = this.force.getDesignForceList('ShearForce', this.save.basic.pickup_shear_force_no[6]);
    
    if(this.DesignForceList.length < 1 ){
      return null;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList]);
    // POST 用
    const postData = this.post.getPostData(this.DesignForceList, 3, 'ShearForce', '耐力', 1);
    return postData;
  }

}
