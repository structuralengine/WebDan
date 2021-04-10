import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ResultViewerComponent } from '../../calculation/result-viewer/result-viewer.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { WaitDialogComponent } from '../wait-dialog/wait-dialog.component';

import { UserInfoService } from '../../providers/user-info.service';
import * as FileSaver from 'file-saver';
import { SaveDataService } from '../../providers/save-data.service';
import { ConfigService } from '../../providers/config.service';
import { DsdDataService } from 'src/app/providers/dsd-data.service';

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
    private dsdData: DsdDataService,
    private http: HttpClient,
    private platformLocation: PlatformLocation,
    private router: Router,
    private config: ConfigService) {

    this.loggedIn = this.user.loggedIn;
    this.fileName = '';
    this.pickup_file_name = '';
  }

  ngOnInit() {
  }

  // 新規作成
  renew(): void {
    this.router.navigate(['/blank-page']);
    this.app.dialogClose(); // 現在表示中の画面を閉じる
    this.app.isManual = true;
    this.app.isCalculated = false;
    this.InputData.clear();
  }

  // ファイルを開く
  open(evt) {
    const file = evt.target.files[0];
    const modalRef = this.modalService.open(WaitDialogComponent);
    this.fileName = file.name;
    evt.target.value = '';
    this.router.navigate(['/blank-page']);
    let error = null;
    switch( this.InputData.getExt(this.fileName)){
      case 'dsd':
        this.fileToBinary(file)
        .then(buff  => { 
          const pik =this.dsdData.readDsdData(buff);
          if (pik !== null){
            this.pickup_file_name = pik + ' を開いてください！';
            alert(this.pickup_file_name);
          }
        })
        .catch(err => { error = err; });
        break;
      default:
        this.fileToText(file)
        .then(text => { this.InputData.readInputData(text); })
        .catch(err => { error = err; });
    }

    // 後処理
    if( error === null ){
      this.app.dialogClose(); // 現在表示中の画面を閉じる
      this.app.isManual = this.InputData.isManual();
      this.app.isCalculated = false;
      this.pickup_file_name = this.InputData.pickup_filename;
    } else {
      console.log(error)
    }
    modalRef.close();
  }

  // ピックアップファイルを開く
  pickup(evt) {
    const file = evt.target.files[0];
    const modalRef = this.modalService.open(WaitDialogComponent);
    evt.target.value = '';
    this.fileToText(file)
      .then(text => {
        this.app.dialogClose(); // 現在表示中の画面を閉じる
        this.InputData.readPickUpData(text, file.name); // データを読み込む
        this.pickup_file_name = this.InputData.pickup_filename;
        this.app.isManual = false;
        this.app.isCalculated = false;
        if (this.router.url === this.router.config[0].redirectTo ) {
          this.router.navigate(['/blank-page']);
        } else {
          this.router.navigate(['/']);
        }
        modalRef.close();
      })
      .catch(err => {
        this.app.isManual = this.InputData.isManual();
        this.app.isCalculated = false;
        modalRef.close();
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

  // バイナリのファイルを読み込む
  private fileToBinary(file): any {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
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
    this.config.saveActiveComponentData();
    const inputJson: string = this.InputData.getInputText();
    const blob = new window.Blob([inputJson], { type: 'text/plain' });
    if (this.fileName.length === 0) {
      this.fileName = 'WebDan.wdj';
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
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .subscribe(
        response => {
          // 通信成功時の処理（成功コールバック）
          const response_text = response;
          if ('error' in response_text) {
            this.user.errorMessage = response_text['error'];
          } else {
            this.user.user_id = response_text['user_id'];
            this.user.purchase_value = response_text['purchase_value'];
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
