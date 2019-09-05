import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { ResultDataService } from '../result-data.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcDurabilityMomentService {
  // 使用性 曲げひび割れ
  public DesignForceList: any[]; // 永久荷重
  private DesignForceList1: any[]; // 縁応力検討用

  constructor(private save: SaveDataService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcServiceabilityMomentService) {
    this.DesignForceList = null;
    this.DesignForceList1 = null;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(isPrintOut: boolean): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return new Array();
    }
    // 永久荷重
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[1]);

    // 縁応力度検討用
    this.DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[0]);


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
    const postData = this.post.getPostData(this.DesignForceList, 0, 'Moment', '応力度', DesignForceListList.length);
    return postData;
  }


  
}
