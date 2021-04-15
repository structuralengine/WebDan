import { Component } from "@angular/core";
import { InputDesignPointsService } from "./components/design-points/design-points.service";
import { ConfigService } from "./providers/config.service";
import { SaveDataService } from "./providers/save-data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  constructor(
    private config: ConfigService,
    private save: SaveDataService,
    public points: InputDesignPointsService) { }

  public isManual(): boolean{
    return this.save.isManual();
  }

  // 画面遷移したとき現在表示中のコンポーネントを覚えておく
  public onActivate(componentRef: any): void {
    this.config.setActiveComponent(componentRef);
  }
  public onDeactivate(componentRef: any): void {
    this.config.setActiveComponent(null);
  }

  public activePageChenge(id: number): void {
    this.deactiveButtons();
    document.getElementById(id.toString()).classList.add("is-active");
  }

  // アクティブになっているボタンを全て非アクティブにする
  public deactiveButtons() {
    for (let i = 0; i <= 9; i++) {
      const data = document.getElementById(i + "");
      if (data != null) {
        if (data.classList.contains("is-active")) {
          data.classList.remove("is-active");
        }
      }
    }
  }

  // 部材に何か入力されたら呼ばれる
  // 有効な入力行があったら次のボタンを有効にする
  private isMemberEnable = false;
  public memberEnable(flg: boolean): void {
    if (this.isMemberEnable === flg) {
      return;
    }
    for (const id of ['2', '7']) {
      const data = document.getElementById(id);
      if (data != null) {
        if (flg === true) {
          if (data.classList.contains("disabled")) {
            data.classList.remove("disabled");
          }
        } else {
          if (!data.classList.contains("disabled")) {
            data.classList.add("disabled");
          }
        }
      }
    }
    this.isMemberEnable = flg;
    this.save.setGroupeList();
    this.designPointEnable(this.points.designPointChange());
  }

  // 算出点に何か入力されたら呼ばれる
  // 有効な入力行があったら次のボタンを有効にする
  private isDesignPointEnable = false;
  public designPointEnable(flg: boolean): void {
    if (this.isDesignPointEnable === flg) {
      return;
    }
    for (const id of ['3', '4', '5', '6', '4', '9']) {
      const data = document.getElementById(id);
      if (data != null) {
        if (flg === true) {
          if (data.classList.contains("disabled")) {
            data.classList.remove("disabled");
          }
        } else {
          if (!data.classList.contains("disabled")) {
            data.classList.add("disabled");
          }
        }
      }
    }
    this.isDesignPointEnable = flg;
  }


}
