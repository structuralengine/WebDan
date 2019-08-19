import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ResultViewerComponent } from '../../calculation/result-viewer/result-viewer.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { WaitDialogComponent } from '../wait-dialog/wait-dialog.component';

import { UserInfoService } from '../../providers/user-info.service';
import * as FileSaver from 'file-saver';
import { SaveDataService } from '../../providers/save-data.service';
import { ResultDataService } from '../../calculation/result-data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  loginUserName: string;
  userPoint: string;
  loggedIn: boolean;
  fileName: string;
  baseUrl: string;
  pickup_file_name: string;

  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private user: UserInfoService,
    private InputData: SaveDataService,
    private ResultData: ResultDataService,
    private http: Http,
    private platformLocation: PlatformLocation,
    private router: Router) {

    this.loggedIn = this.user.loggedIn;
    this.fileName = '';
    this.pickup_file_name = '';
  }

  ngOnInit() {
  }

  // 新規作成
  renew(): void {
    this.router.navigate(['/calculation-print']);
    this.app.dialogClose(); // 現在表示中の画面を閉じる
    this.app.isManual = true;
    this.app.isCalculated = false;
    this.InputData.clear();
    this.ResultData.clear();
    this.router.navigate(['/']);
  }

  // ファイルを開く
  open(evt) {
    const file = evt.target.files[0];
    this.fileName = file.name;
    evt.target.value = '';
    this.router.navigate(['/calculation-print']);
    this.fileToText(file)
      .then(text => {
        this.app.dialogClose(); // 現在表示中の画面を閉じる
        this.InputData.readInputData(text); // データを読み込む
        this.app.isManual = this.InputData.isManual();
        this.app.isCalculated = false;
      })
      .catch(err => console.log(err));
  }

  // ピックアップファイルを開く
  pickup(evt) {
    const file = evt.target.files[0];
    evt.target.value = '';
    this.fileToText(file)
      .then(text => {
        this.app.dialogClose(); // 現在表示中の画面を閉じる
        this.InputData.readPickUpData(text, file.name); // データを読み込む
        this.pickup_file_name = this.InputData.pickup_filename;
        this.app.isManual = true;
        this.app.isCalculated = false;
        if (this.router.url === this.router.config[0].redirectTo ) {
          this.router.navigate(['/calculation-print']);
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch(err => {
        this.app.isManual = this.InputData.isManual();
        this.app.isCalculated = false;
        console.log(err);
      });
  }

  // ファイルのテキストを読み込む
  private fileToText(file): any {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }


  // ファイルを保存
  save(): void {
    const inputJson: string = this.InputData.getInputText();
    const blob = new window.Blob([inputJson], { type: 'text/plain' });
    if (this.fileName.length === 0) {
      this.fileName = 'WebDan.json';
    }
    FileSaver.saveAs(blob, this.fileName);
  }

  // ログイン関係
  private logIn(): void {
    this.modalService.open(LoginDialogComponent).result.then((result) => {
      this.loggedIn = this.user.loggedIn;
      if (this.loggedIn === true) {
        this.loginUserName = this.user.loginUserName;
        this.userPoint = this.user.purchase_value.toString();
      }
    });
    // 「ユーザー名」入力ボックスにフォーカスを当てる
    document.getElementById('user_name_id').focus();
  }

  // ユーザーポイントを更新
  private setUserPoint() {
    const url = 'https://structuralengine.com/my-module/get_points_balance.php?id=' 
              + this.user.loginUserName + '&ps=' + this.user.loginPassword;
    this.http.get(url, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .subscribe(
        response => {
          // 通信成功時の処理（成功コールバック）
          const response_text = JSON.parse(response.text());
          if ('error' in response_text) {
            this.user.errorMessage = response_text.error;
          } else {
            this.user.user_id = response_text.user_id;
            this.user.purchase_value = response_text.purchase_value;
            this.user.loggedIn = true;
            this.userPoint = this.user.purchase_value.toString();
          }
        },
        error => {
          // 通信失敗時の処理（失敗コールバック）
          this.user.errorMessage = error.statusText;
        }
      );
  }


}
