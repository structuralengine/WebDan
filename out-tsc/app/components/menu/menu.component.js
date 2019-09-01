import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { UserInfoService } from '../../providers/user-info.service';
import * as FileSaver from 'file-saver';
import { SaveDataService } from '../../providers/save-data.service';
var MenuComponent = /** @class */ (function () {
    function MenuComponent(modalService, app, user, InputData, http, platformLocation, router) {
        this.modalService = modalService;
        this.app = app;
        this.user = user;
        this.InputData = InputData;
        this.http = http;
        this.platformLocation = platformLocation;
        this.router = router;
        this.loggedIn = this.user.loggedIn;
        this.fileName = '';
        this.pickup_file_name = '';
    }
    MenuComponent.prototype.ngOnInit = function () {
    };
    // 新規作成
    MenuComponent.prototype.renew = function () {
        this.router.navigate(['/calculation-print']);
        this.app.dialogClose(); // 現在表示中の画面を閉じる
        this.app.isManual = true;
        this.app.isCalculated = false;
        this.InputData.clear();
        this.router.navigate(['/']);
    };
    // ファイルを開く
    MenuComponent.prototype.open = function (evt) {
        var _this = this;
        var file = evt.target.files[0];
        this.fileName = file.name;
        evt.target.value = '';
        this.router.navigate(['/blank-page']);
        this.fileToText(file)
            .then(function (text) {
            _this.app.dialogClose(); // 現在表示中の画面を閉じる
            _this.InputData.readInputData(text); // データを読み込む
            _this.app.isManual = _this.InputData.isManual();
            _this.app.isCalculated = false;
            _this.pickup_file_name = _this.InputData.pickup_filename;
        })
            .catch(function (err) { return console.log(err); });
    };
    // ピックアップファイルを開く
    MenuComponent.prototype.pickup = function (evt) {
        var _this = this;
        var file = evt.target.files[0];
        evt.target.value = '';
        this.fileToText(file)
            .then(function (text) {
            _this.app.dialogClose(); // 現在表示中の画面を閉じる
            _this.InputData.readPickUpData(text, file.name); // データを読み込む
            _this.pickup_file_name = _this.InputData.pickup_filename;
            _this.app.isManual = true;
            _this.app.isCalculated = false;
            if (_this.router.url === _this.router.config[0].redirectTo) {
                _this.router.navigate(['/blank-page']);
            }
            else {
                _this.router.navigate(['/']);
            }
        })
            .catch(function (err) {
            _this.app.isManual = _this.InputData.isManual();
            _this.app.isCalculated = false;
            console.log(err);
        });
    };
    // ファイルのテキストを読み込む
    MenuComponent.prototype.fileToText = function (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(reader.error);
            };
        });
    };
    // ファイルを保存
    MenuComponent.prototype.save = function () {
        var inputJson = this.InputData.getInputText();
        var blob = new window.Blob([inputJson], { type: 'text/plain' });
        if (this.fileName.length === 0) {
            this.fileName = 'WebDan.json';
        }
        FileSaver.saveAs(blob, this.fileName);
    };
    // ログイン関係
    MenuComponent.prototype.logIn = function () {
        var _this = this;
        this.modalService.open(LoginDialogComponent).result.then(function (result) {
            _this.loggedIn = _this.user.loggedIn;
            if (_this.loggedIn === true) {
                _this.loginUserName = _this.user.loginUserName;
                _this.userPoint = _this.user.purchase_value.toString();
            }
        });
        // 「ユーザー名」入力ボックスにフォーカスを当てる
        document.getElementById('user_name_id').focus();
    };
    // ユーザーポイントを更新
    MenuComponent.prototype.setUserPoint = function () {
        var _this = this;
        var url = 'https://structuralengine.com/my-module/get_points_balance.php?id='
            + this.user.loginUserName + '&ps=' + this.user.loginPassword;
        this.http.get(url, {
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
            .subscribe(function (response) {
            // 通信成功時の処理（成功コールバック）
            var response_text = JSON.parse(response.text());
            if ('error' in response_text) {
                _this.user.errorMessage = response_text.error;
            }
            else {
                _this.user.user_id = response_text.user_id;
                _this.user.purchase_value = response_text.purchase_value;
                _this.user.loggedIn = true;
                _this.userPoint = _this.user.purchase_value.toString();
            }
        }, function (error) {
            // 通信失敗時の処理（失敗コールバック）
            _this.user.errorMessage = error.statusText;
        });
    };
    MenuComponent = tslib_1.__decorate([
        Component({
            selector: 'app-menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [NgbModal,
            AppComponent,
            UserInfoService,
            SaveDataService,
            Http,
            PlatformLocation,
            Router])
    ], MenuComponent);
    return MenuComponent;
}());
export { MenuComponent };
//# sourceMappingURL=menu.component.js.map