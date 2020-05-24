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
  public isEnable: boolean;

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService) {
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
  public setDesignForces(): void{

    this.isEnable = false;

    this.DesignForceList = new Array();
  
    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    if (this.save.isManual() === true) {
      this.DesignForceList = this.force.getDesignForceList('Vd', this.save.basic.pickup_shear_force_no[5]);
    } else { 
      this.DesignForceList = this.force.getDesignForceList('Vd', this.save.basic.pickup_shear_force_no[6]);
    }

    if(this.DesignForceList.length < 1 ){
      return;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList], 'Vd');
    
    for (let i = this.DesignForceList[0].length - 1; i >= 0; i--) {
      const df = this.DesignForceList[0][i];
      for (let j = df.positions.length -1; j >= 0; j--){
        const ps = df.positions[j];
        if ( !('PostData0' in ps) ){
          df.positions.splice(j,1);
          continue;
        }
        const pd = ps.PostData0[0];
        if (pd.Vd === 0){
          df.positions.splice(j,1);
        }       
      }
      if(df.positions.length == 0){
        this.DesignForceList[0].splice(i,1);
      }
    }

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if(this.DesignForceList.length < 1 ){
      return null;
    }

    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 3, 'Vd', '耐力', 1);
    return postData;
  }

}
