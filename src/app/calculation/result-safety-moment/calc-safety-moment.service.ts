import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { ResultDataService } from '../result-data.service';

import { Injectable } from '@angular/core';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyMomentService {
  // 安全性（破壊）曲げモーメント
  public DesignForceList: any[];
  public isEnable: boolean;
  public safetyID: number = 2;

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService) {
      
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void {

    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_moment_checked === false) {
      return;
    }

    this.DesignForceList = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(5));

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1 ) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Md', '耐力', this.safetyID, this.DesignForceList);
    return postData;
  }

  public getResultValue(postData: any, resultData: any, member: any): any {

    const safety_factor = this.safety.getCalcData( 'Md', member.g_id, this.safetyID );
 
    const Md: number = Math.abs(postData.Md);
    const Mu: number = resultData.M.Mi;
    const rb: number = safety_factor.rb;
    const Mud: number = Mu / rb;
    const ri: number = safety_factor.ri;
    const ratio: number = ri * Md / Mud;
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      εcu: resultData.M.εc,
      εs: resultData.M.εs,
      x: resultData.M.x,
      Mu,
      rb,
      Mud,
      ri,
      ratio,
      result
    };

  }

}

