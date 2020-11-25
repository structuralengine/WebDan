import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { SetPostDataService } from '../set-post-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CalcEarthquakesShearForceService {
  // 復旧性（地震時）せん断力
  public DesignForceList: any[];
  public isEnable: boolean;

  constructor(private save: SaveDataService,
              private force: SetDesignForceService,
              private post: SetPostDataService) {
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  public setDesignForces(): void {
    this.isEnable = false;

    this.DesignForceList = new Array();

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    this.DesignForceList = this.force.getDesignForceList('Vd', this.save.basic.pickup_shear_force_no[7]);


    if (this.DesignForceList.length < 1 ) {
      return;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList], 'Vd');

    for (let i = this.DesignForceList.length - 1; i >= 0; i--) {
      for (let j = this.DesignForceList[i].length - 1; j >= 0; j--) {
        const df = this.DesignForceList[i][j];
        for (let k = df.positions.length - 1; k >= 0; k--) {
          const ps = df.positions[k];
          if (ps === undefined) {
            df.positions.splice(k, 1);
            continue;
          }             
          if (!('PostData0' in ps)) {
            df.positions.splice(k, 1);
            continue;
          }
          const pd = ps.PostData0[0];
          if (pd.Vd === 0) {
            df.positions.splice(k, 1);
          }
        }
        if (df.positions.length === 0) {
          this.DesignForceList[i].splice(j, 1);
        }
      }
      if (this.DesignForceList[i].length === 0) {
        this.DesignForceList.splice(i, 1);
      }
    }

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1 ) {
      return null;
    }
    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 4, 'Vd', '耐力', 1);
    return postData;
  }

}
