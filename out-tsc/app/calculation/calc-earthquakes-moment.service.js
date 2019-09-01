import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';
import { Injectable } from '@angular/core';
var CalcEarthquakesMomentService = /** @class */ (function (_super) {
    tslib_1.__extends(CalcEarthquakesMomentService, _super);
    // 復旧性（地震時）曲げモーメント
    function CalcEarthquakesMomentService(save, calc) {
        var _this = _super.call(this, save, calc) || this;
        _this.save = save;
        _this.calc = calc;
        return _this;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcEarthquakesMomentService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[9]); // ピックアップNoは 曲げの9番目に保存されている
        this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcEarthquakesMomentService.prototype.getEarthquakesPages = function () {
        var result = this.getRestorabilityPages('復旧性（地震時）曲げモーメントの照査結果');
        return result;
    };
    CalcEarthquakesMomentService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcEarthquakesMomentService);
    return CalcEarthquakesMomentService;
}(CalcRestorabilityMomentService));
export { CalcEarthquakesMomentService };
//# sourceMappingURL=calc-earthquakes-moment.service.js.map