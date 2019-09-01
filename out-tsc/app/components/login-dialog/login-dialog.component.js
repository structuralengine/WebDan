import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, Headers } from '@angular/http';
import { UserInfoService } from '../../providers/user-info.service';
var LoginDialogComponent = /** @class */ (function () {
    function LoginDialogComponent(activeModal, http, user) {
        this.activeModal = activeModal;
        this.http = http;
        this.user = user;
        this.loginError = false;
        this.connecting = false;
    }
    LoginDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        //　エンターキーでログイン可能にする。
        //　不要な場合は以下の処理を消してください。
        document.body.onkeydown = function (e) {
            if (e.key === 'Enter') {
                _this.onClick();
            }
        };
    };
    LoginDialogComponent.prototype.onClick = function () {
        var _this = this;
        this.connecting = true;
        var url = 'https://structuralengine.com/my-module/get_points_balance.php?id=' + this.loginUserName + '&ps=' + this.loginPassword;
        this.http.get(url, {
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
            .subscribe(function (response) {
            // 通信成功時の処理（成功コールバック）
            var response_text = JSON.parse(response.text());
            if ('error' in response_text) {
                _this.errorMessage = response_text.error;
                _this.loginError = true;
                _this.connecting = false;
            }
            else {
                _this.user.loginUserName = _this.loginUserName;
                _this.user.loginPassword = _this.loginPassword;
                _this.user.user_id = response_text.user_id;
                _this.user.purchase_value = response_text.purchase_value;
                _this.user.loggedIn = true;
                _this.activeModal.close('Submit');
            }
        }, function (error) {
            // 通信失敗時の処理（失敗コールバック）
            _this.errorMessage = error.statusText;
            _this.loginError = true;
            _this.connecting = false;
        });
    };
    LoginDialogComponent = tslib_1.__decorate([
        Component({
            selector: 'app-login-dialog',
            templateUrl: './login-dialog.component.html',
            styleUrls: ['./login-dialog.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal,
            Http,
            UserInfoService])
    ], LoginDialogComponent);
    return LoginDialogComponent;
}());
export { LoginDialogComponent };
//# sourceMappingURL=login-dialog.component.js.map