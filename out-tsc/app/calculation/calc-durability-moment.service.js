import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';
import { Injectable } from '@angular/core';
var CalcDurabilityMomentService = /** @class */ (function (_super) {
    tslib_1.__extends(CalcDurabilityMomentService, _super);
    // 使用性 曲げひび割れ
    function CalcDurabilityMomentService(save, calc) {
        var _this = _super.call(this, save, calc) || this;
        _this.save = save;
        _this.calc = calc;
        return _this;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcDurabilityMomentService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[0]); // 縁応力度検討用
        pickupNoList.push(this.save.basic.pickup_moment_no[1]); // 鉄筋応力度検討用
        pickupNoList.push(this.save.basic.pickup_moment_no[4]); // 永久荷重
        if (this.save.basic.pickup_moment_no[3] !== null) {
            pickupNoList.push(this.save.basic.pickup_moment_no[3]); // 変動荷重
        }
        this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
            return result;
        }
        // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
        return result;
    };
    CalcDurabilityMomentService.prototype.getDurabilityPages = function () {
        var result = this.getServiceabilityPages('使用性（外観）曲げひび割れの照査結果');
        return result;
    };
    CalcDurabilityMomentService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcDurabilityMomentService);
    return CalcDurabilityMomentService;
}(CalcServiceabilityMomentService));
export { CalcDurabilityMomentService };
//# sourceMappingURL=calc-durability-moment.service.js.map