import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { InputDataService } from './providers/input-data.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(platformLocation, _router, input) {
        this._router = _router;
        this.input = input;
        var location = platformLocation.location;
        this.baseUrl = location.origin + location.pathname;
        console.log('baseUrl', this.baseUrl);
        // custom property
        this.isCalculated = false;
        this.isManual = true;
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.dialogClose = function () {
        this.deactiveButtons();
    };
    AppComponent.prototype.activePageChenge = function (id) {
        this.deactiveButtons();
        document.getElementById(id).classList.add('active');
    };
    // アクティブになっているボタンを全て非アクティブにする
    AppComponent.prototype.deactiveButtons = function () {
        for (var i = 0; i <= 11; i++) {
            var data = document.getElementById(i + '');
            if (data != null) {
                if (data.classList.contains('active')) {
                    data.classList.remove('active');
                }
            }
        }
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [PlatformLocation,
            Router,
            InputDataService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map