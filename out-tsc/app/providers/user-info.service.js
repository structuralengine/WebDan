import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
var UserInfoService = /** @class */ (function () {
    function UserInfoService(http) {
        this.http = http;
        this.clear();
    }
    UserInfoService.prototype.clear = function () {
        this.loginUserName = '';
        this.loginPassword = '';
        this.user_id = -1;
        this.purchase_value = -1;
        this.loggedIn = false;
    };
    UserInfoService.prototype.Login = function () {
        var _this = this;
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
                _this.loggedIn = false;
            }
            else {
                _this.user_id = response_text.user_id;
                _this.purchase_value = response_text.purchase_value;
                _this.loggedIn = true;
            }
        }, function (error) {
            // 通信失敗時の処理（失敗コールバック）
            _this.errorMessage = error.statusText;
            _this.loggedIn = false;
        });
        return this.loggedIn;
    };
    UserInfoService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Http])
    ], UserInfoService);
    return UserInfoService;
}());
export { UserInfoService };
//# sourceMappingURL=user-info.service.js.map