import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcDurabilityMomentService {
  // 使用性 曲げひび割れ
  private DesignForceList: any[];

  constructor(private save: SaveDataService,
              private calc: ResultDataService,
              private base: CalcServiceabilityMomentService ) {
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): any[] {

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if ( this.save.calc.print_selected.calculate_moment_checked === false){
      this.DesignForceList = new Array();
      return new Array();
    }

    const pickupNoList: any[] = new Array();
    pickupNoList.push(this.save.basic.pickup_moment_no[0]); // 縁応力度検討用
    pickupNoList.push(this.save.basic.pickup_moment_no[1]); // 鉄筋応力度検討用
    pickupNoList.push(this.save.basic.pickup_moment_no[4]); // 永久荷重
    if (this.save.basic.pickup_moment_no[3] !== null ) {
      pickupNoList.push(this.save.basic.pickup_moment_no[3]); // 変動荷重
    }
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

  public getDurabilityPages(): any[] {
        // 出力テーブル用のデータにセット
        const result: any[] = this.setDurabilityPages();
        return result;
      }
    
  private setDurabilityPages(): any[] {
    const result: any[] = this.base.getServiceabilityPages('使用性（外観）曲げひび割れの照査結果');
    return result;
  }
}
