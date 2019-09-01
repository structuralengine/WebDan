import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';
import { Injectable } from '@angular/core';
var CalcEarthquakesShearForceService = /** @class */ (function (_super) {
    tslib_1.__extends(CalcEarthquakesShearForceService, _super);
    // 復旧性（地震時）せん断力
    function CalcEarthquakesShearForceService(save, calc) {
        var _this = _super.call(this, save, calc) || this;
        _this.save = save;
        _this.calc = calc;
        return _this;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcEarthquakesShearForceService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[7]); // ピックアップNoは せん断の7番目に保存されている
        this.DesignForceList = this.calc.getDesignForceList('ShearForce', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcEarthquakesShearForceService.prototype.getEarthquakesPages = function () {
        var result = this.getSafetyPages('復旧性（地震時以外）せん断力の照査結果');
        return result;
    };
    CalcEarthquakesShearForceService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcEarthquakesShearForceService);
    return CalcEarthquakesShearForceService;
}(CalcSafetyShearForceService));
export { CalcEarthquakesShearForceService };
//# sourceMappingURL=calc-earthquakes-shear-force.service.js.map