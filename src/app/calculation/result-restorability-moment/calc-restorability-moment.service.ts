import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';

import { Injectable } from '@angular/core';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { InputSafetyFactorsMaterialStrengthsService } from 'src/app/components/safety-factors-material-strengths/safety-factors-material-strengths.service';

@Injectable({
  providedIn: 'root'
})

export class CalcRestorabilityMomentService {
  // 復旧性（地震時以外）曲げモーメント
  public DesignForceList: any[];
  public isEnable: boolean;
  public safetyID: number = 3;

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    public base: CalcSafetyMomentService,
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService) {

    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void{

    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_moment_checked === false) {
      return;
    }

    this.DesignForceList = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(6));

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if(this.DesignForceList.length < 1 ){
      return null;
    }

    // POST 用
    const postData = this.post.setInputData('Md', '耐力', this.safetyID, this.DesignForceList);
    return postData;
  }

  public getSafetyFactor(g_id: string, safetyID: number){
    return this.safety.getCalcData('Md', g_id, safetyID);
  }


  public getResultValue(resultData: any, member: any, DesignForceList: any): any {

    DesignForceList = (DesignForceList===null) ? this.DesignForceList : DesignForceList;
    const force = DesignForceList.find(v => v.index === resultData.index)
                      .designForce.find(v => v.side === resultData.side)

    const safety_factor = this.safety.getCalcData( 'Md', member.g_id, this.safetyID );

    const Md: number = Math.abs(force.Md);
    const My: number = resultData.Y.Mi;
    const rb: number = safety_factor.rb;
    const Myd: number = My / rb;
    const ri: number = safety_factor.ri;
    const ratio: number = ri * Md / Myd;
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Nd: force.Nd,
      Md,
      εcu: resultData.Y.εc,
      εs: resultData.Y.εs,
      x: resultData.Y.x,
      My,
      rb,
      Myd,
      ri,
      ratio,
      result
    };
  }
}

