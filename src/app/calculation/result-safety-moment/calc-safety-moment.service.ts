import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { ResultDataService } from '../result-data.service';

import { Injectable } from '@angular/core';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyMomentService {
  // 安全性（破壊）曲げモーメント
  public DesignForceList: any[];
  public isEnable: boolean;

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService,
              private result: ResultDataService,
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
    const postData = this.post.setInputData('Md', '耐力', 2, this.DesignForceList);
    return postData;
  }

  public getResultString(PrintData: any, resultData: any, safety_factor: any): any {

    const Md: number = Math.abs(PrintData.Md);
    const Mu: number = resultData.M.Mi;
    const rb: number = safety_factor.rb;
    const Mud: number = Mu / rb;
    const ri: number = safety_factor.ri;
    const ratio: number = ri * Md / Mud;
    const result: string = (ratio < 1) ? 'OK' : 'NG';

    return {
      Md: { alien: 'right', value: Md.toFixed(1) },
      Nd: { alien: 'right', value: PrintData.Nd.toFixed(1) },
      εcu: { alien: 'right', value: resultData.M.εc.toFixed(5) },
      εs: { alien: 'right', value: resultData.M.εs.toFixed(5) },
      x: { alien: 'right', value: resultData.M.x.toFixed(1) },
      Mu: { alien: 'right', value: Mu.toFixed(1) },
      rb: { alien: 'right', value: rb.toFixed(2) },
      Mud: { alien: 'right', value: Mud.toFixed(1) },
      ri: { alien: 'right', value: ri.toFixed(2) },
      ratio: { alien: 'right', value: ratio.toFixed(3) },
      result: { alien: 'center', value: result }
    };
  }

}

