import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';
import { InputBasicInformationService } from 'src/app/components/basic-information/basic-information.service';
import { InputCalclationPrintService } from 'src/app/components/calculation-print/calculation-print.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcEarthquakesMomentService {
  // 復旧性（地震時）曲げモーメント
  public DesignForceList: any[];
  public isEnable: boolean;

  constructor(
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService ) {
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

    this.DesignForceList = this.force.getDesignForceList('Md', this.basic.pickup_moment_no(7));

    if (this.DesignForceList.length < 1 ){
      return;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData('Md', this.DesignForceList);

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if(this.DesignForceList.length < 1 ){
      return null;
    }
    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 4, 'Md', '耐力', 1);
    return postData;
  }

}
