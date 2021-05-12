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
      ["Md"],
      this.basic.pickup_moment_no(1)
    );
    // 縁応力検討用
    this.DesignForceList1 = this.force.getDesignForceList(
      ["Md"],
      this.basic.pickup_moment_no(0)
    );

    // 複数の断面力の整合性を確認する
    this.force.AlignMultipleLists(this.DesignForceList, this.DesignForceList1);

    // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
    this.deleteDurabilityDisablePosition();
  }

  // 使用性（外観ひび割れ）の照査対象外の着目点を削除する
  private deleteDurabilityDisablePosition() {
    for (let ig = this.DesignForceList.length - 1; ig >= 0; ig--) {
      const groupe = this.DesignForceList[ig],
        groupe1 = this.DesignForceList1[ig];
      for (let im = groupe.length - 1; im >= 0; im--) {
        const member = groupe[im],
          member1 = groupe1[im];
        for (let ip = member.positions.length - 1; ip >= 0; ip--) {
          const position: any = member.positions[ip];
          const memberInfo = this.crack
            .getSaveData()
            .find((value) => value.index === position.index);

          const designForce0 = position.designForce;
          const designForce1 = member1.positions[ip].designForce;
          for (let i = designForce0.length - 1; i >= 0; i--) {
            switch (designForce0[i].side) {
              case "上側引張":
                if (memberInfo.vis_u !== true) {
                  designForce0.splice(i, 1);
                  designForce1.splice(i, 1);
                }
                break;
              case "下側引張":
                if (memberInfo.vis_l !== true) {
                  designForce0.splice(i, 1);
                  designForce1.splice(i, 1);
                }
                break;
            }
            if (designForce0.Md === 0) {
              designForce0.splice(i, 1);
              designForce1.splice(i, 1);
            }
          }

          if (position.designForce.length < 1) {
            member.positions.splice(ip, 1);
            member1.positions.splice(ip, 1);
          }
        }
        if (member.positions.length < 1) {
          groupe.splice(im, 1);
          groupe1.splice(im, 1);
        }
      }
      if (groupe.length < 1) {
        this.DesignForceList.splice(ig, 1);
        this.DesignForceList1.splice(ig, 1);
      }
    }
  }

  // サーバー POST用データを生成する
  public setInputData(): any {
    if (this.DesignForceList.length < 1) {
      return null;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData("Md", this.DesignForceList, this.DesignForceList1);

    // POST 用
    const postData = this.post.setInputData(
      this.DesignForceList,
      0,
      "Md",
      "応力度",
      2
    );
    return postData;
  }
}
