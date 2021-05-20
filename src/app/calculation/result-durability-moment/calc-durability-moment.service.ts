import { SetDesignForceService } from "../set-design-force.service";
import { SetPostDataService } from "../set-post-data.service";

import { Injectable } from "@angular/core";
import { InputBasicInformationService } from "src/app/components/basic-information/basic-information.service";
import { InputCalclationPrintService } from "src/app/components/calculation-print/calculation-print.service";
import { InputCrackSettingsService } from "src/app/components/crack/crack-settings.service";

@Injectable({
  providedIn: "root",
})
export class CalcDurabilityMomentService {
  // 使用性 曲げひび割れ
  public DesignForceList: any[];
  public DesignForceList1: any[];

  public isEnable: boolean;
  public safetyID: number = 0;

  constructor(
    private crack: InputCrackSettingsService,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private basic: InputBasicInformationService,
    private calc: InputCalclationPrintService
  ) {
    this.DesignForceList = null;
    this.isEnable = false;
  }

  // 設計断面力の集計
  public setDesignForces(): void {
    this.isEnable = false;

    this.DesignForceList = new Array();

    // 曲げモーメントが計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_moment_checked === false) {
      return;
    }
    // 永久荷重
    this.DesignForceList = this.force.getDesignForceList(
      "Md", this.basic.pickup_moment_no(1));
    // 縁応力検討用
    this.DesignForceList1 = this.force.getDesignForceList(
      "Md", this.basic.pickup_moment_no(0));

    // 複数の断面力の整合性を確認する
    this.force.alignMultipleLists(this.DesignForceList, this.DesignForceList1);

    // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
    this.deleteDurabilityDisablePosition();
  }

  // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
  private deleteDurabilityDisablePosition() {

    for (let ip = this.DesignForceList.length - 1; ip >= 0; ip--) {
      const pos: any = this.DesignForceList[ip];
      const info = this.crack.getCalcData(pos.index);

      const force0 = pos.designForce;
      const force1 = this.DesignForceList1[ip].designForce;
      for (let i = force0.length - 1; i >= 0; i--) {
        if(( force0[i].side==="上側引張" && info.vis_u !== true) ||
            (force0[i].side==="下側引張" && info.vis_l !== true) ||
            (force0[i].Md === 0)) {
          force0.splice(i, 1);
          force1.splice(i, 1);
        }
      }

      if (pos.designForce.length < 1) {
        this.DesignForceList.splice(ip, 1);
        this.DesignForceList1.splice(ip, 1);
      }
    }
  }

  // サーバー POST用データを生成する
  public setInputData(): any {
    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData("Md", "応力度", this.safetyID,  this.DesignForceList, this.DesignForceList1);
    return postData;
  }
}
