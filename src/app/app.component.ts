import { Component, OnInit, ViewChild } from "@angular/core";
import { PlatformLocation } from "@angular/common";
import { ConfigService } from "./providers/config.service";
import { InputMembersService } from "./components/members/members.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  baseUrl: string;
  project: string;

  isCalculated: boolean;
  isSRC: boolean; // SRC部材 があるかどうか

  activeComponentRef: any;

  constructor(
    platformLocation: PlatformLocation,
    private config: ConfigService,
    private member: InputMembersService
  ) {
    const location = (platformLocation as any).location;
    this.baseUrl = location.origin + location.pathname;
    console.log("baseUrl", this.baseUrl);

    // custom property
    this.isCalculated = false;
  }

  ngOnInit() {
    this.isSRC = this.member.getSRC().some((v) => v > 0);
  }

  dialogClose(): void {
    this.deactiveButtons();
  }

  // 画面遷移したとき現在表示中のコンポーネントを覚えておく
  onActivate(componentRef: any): void {
    this.config.setActiveComponent(componentRef);
  }
  onDeactivate(componentRef: any): void {
    this.config.setActiveComponent(null);
  }

  activePageChenge(id: string): void {
    this.deactiveButtons();
    document.getElementById(id).classList.add("is-active");
  }

  // アクティブになっているボタンを全て非アクティブにする
  deactiveButtons() {
    for (let i = 0; i <= 9; i++) {
      const data = document.getElementById(i + "");
      if (data != null) {
        if (data.classList.contains("is-active")) {
          data.classList.remove("is-active");
        }
      }
    }
  }

  public getWindowHeight(): number {
    return window.innerHeight;
  }

  // 部材に何か入力されたら呼ばれる
  private isMemberEnable = false;
  public memberEnable(flg: boolean): void {
    if (this.isMemberEnable === flg) {
      return;
    }
    for (const id of ['2', '3',　'4', '5',　'6', '7']) {
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
  }
}
