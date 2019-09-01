import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var InputDataService = /** @class */ (function () {
    function InputDataService() {
        this.DEFAULT_MEMBER_COUNT = 25;
        this.rebar_List = [
            { 'D': 10, 'As': 71.33 },
            { 'D': 13, 'As': 126.7 },
            { 'D': 16, 'As': 198.6 },
            { 'D': 19, 'As': 286.5 },
            { 'D': 22, 'As': 387.1 },
            { 'D': 25, 'As': 506.7 },
            { 'D': 29, 'As': 642.4 },
            { 'D': 32, 'As': 794.2 },
            { 'D': 35, 'As': 956.6 },
            { 'D': 38, 'As': 1140 },
            { 'D': 41, 'As': 1340 },
            { 'D': 51, 'As': 2027 }
        ];
        this.pickup_filename = '';
        this.pickup_data = {};
    }
    InputDataService.prototype.isManual = function () {
        if (this.pickup_filename.trim().length === 0) {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    InputDataService.prototype.getRebar = function (Dia) {
        var result = this.rebar_List.find(function (value) {
            return value.D === Dia;
        });
        return result;
    };
    InputDataService.prototype.getNextRebar = function (Dia) {
        var result = undefined;
        var d = this.toNumber(Dia);
        if (d === null) {
            return undefined;
        }
        ;
        for (var i = 0; i < this.rebar_List.length - 1; i++) {
            if (d === this.rebar_List[i].D) {
                result = this.rebar_List[i + 1];
                break;
            }
        }
        return result;
    };
    InputDataService.prototype.getPreviousRebar = function (Dia) {
        var result = undefined;
        var d = this.toNumber(Dia);
        if (d === null) {
            return undefined;
        }
        ;
        for (var i = 1; i < this.rebar_List.length; i++) {
            if (d === this.rebar_List[i].D) {
                result = this.rebar_List[i - 1];
                break;
            }
        }
        return result;
    };
    /// <summary>
    /// 文字列string を数値にする
    /// </summary>
    /// <param name="num">数値に変換する文字列</param>
    InputDataService.prototype.toNumber = function (num) {
        var result = null;
        try {
            var tmp = num.toString().trim();
            if (tmp.length > 0) {
                result = (function (n) { return isNaN(n) ? null : n; })(+tmp);
            }
        }
        catch (_a) {
            result = null;
        }
        return result;
    };
    InputDataService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], InputDataService);
    return InputDataService;
}());
export { InputDataService };
//# sourceMappingURL=input-data.service.js.map