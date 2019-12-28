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

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.save.calc.print_selected.calculate_moment_checked === false) {
      return;
    }
    // 永久荷重
    this.DesignForceList = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[1]);
    // 縁応力検討用
    const DesignForceList1 = this.force.getDesignForceList('Moment', this.save.basic.pickup_moment_no[0]);

    if (this.DesignForceList.length < 1) {
      return ;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList,  DesignForceList1]);

    // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
    this.deleteDurabilityDisablePosition(this.DesignForceList);

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 0, 'Moment', '応力度', 2);
    return postData;
  }

  // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
  private deleteDurabilityDisablePosition(DesignForceList: any[]) {

    for (let ig = DesignForceList.length - 1; ig >= 0; ig--) {
      const groupe = DesignForceList[ig];
      for (let im = groupe.length - 1; im >= 0; im--) {
        const member = groupe[im];
        for (let ip = member.positions.length - 1; ip >= 0; ip--) {
          let position: any = member.positions[ip];
          const memberInfo = position.memberInfo;
          const PostData0 = position.PostData0;
          const PostData1 = position.PostData1;
          for (let i = PostData0.length - 1; i >= 0; i--) {
            switch (PostData0[i].memo) {
              case '上側引張':
                if (memberInfo.vis_u !== true) {
                  PostData0.splice(i, 1);
                  PostData1.splice(i, 1);
                }
                break;
              case '下側引張':
                if (memberInfo.vis_l !== true) {
                  PostData0.splice(i, 1);
                  PostData1.splice(i, 1);
                }
                break;
            }
          }
          if (position.PostData0.length < 1) {
            member.positions.splice(ip, 1);
          }
        }
        if (member.positions.length < 1) {
          groupe.splice(im, 1);
        }
      }
      if (groupe.length < 1) {
        DesignForceList.splice(ig, 1);
      }     
    }
  }
}
