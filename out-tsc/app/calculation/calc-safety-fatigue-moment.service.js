import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { Injectable } from '@angular/core';
var CalcSafetyFatigueMomentService = /** @class */ (function () {
    function CalcSafetyFatigueMomentService(save, calc) {
        this.save = save;
        this.calc = calc;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcSafetyFatigueMomentService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[5]); // 最小応力
        pickupNoList.push(this.save.basic.pickup_moment_no[6]); // 最大応力
        this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcSafetyFatigueMomentService.prototype.getSafetyFatiguePages = function () {
        var result = new Array();
        for (var i = 0; i < 1; i++) {
            var page = { caption: '安全性（疲労破壊）曲げモーメントの照査結果', columns: new Array() };
            for (var c = 0; c < 5; c++) {
                var column = new Array();
                column.push({ alien: 'center', value: '1部材(0.600)' });
                column.push({ alien: 'center', value: '壁前面(上側)' });
                column.push({ alien: 'center', value: '1' });
                column.push({ alien: 'right', value: '1000' });
                column.push({ alien: 'right', value: '3000' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'right', value: '6353.6' });
                column.push({ alien: 'center', value: 'D32-8 本' });
                column.push({ alien: 'right', value: '82.0' });
                column.push({ alien: 'right', value: '12707.2' });
                column.push({ alien: 'center', value: 'D32-16 本' });
                column.push({ alien: 'right', value: '114.0' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'right', value: '24.0' });
                column.push({ alien: 'right', value: '1.30' });
                column.push({ alien: 'right', value: '18.5' });
                column.push({ alien: 'right', value: '390' });
                column.push({ alien: 'right', value: '1.00' });
                column.push({ alien: 'right', value: '390' });
                column.push({ alien: 'right', value: '390' });
                column.push({ alien: 'right', value: '501.7' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '0' });
                column.push({ alien: 'right', value: '501.7' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '44.18' });
                column.push({ alien: 'right', value: '172.86' });
                column.push({ alien: 'right', value: '0.309' });
                column.push({ alien: 'right', value: '0.06' });
                column.push({ alien: 'right', value: '2.635' });
                column.push({ alien: 'right', value: '2689700' });
                column.push({ alien: 'right', value: '8.63' });
                column.push({ alien: 'right', value: '42.10' });
                column.push({ alien: 'right', value: '0.720' });
                column.push({ alien: 'right', value: '0.898' });
                column.push({ alien: 'right', value: '1.00' });
                column.push({ alien: 'right', value: '1.000' });
                column.push({ alien: 'right', value: '1.05' });
                column.push({ alien: 'right', value: '169.06' });
                column.push({ alien: 'right', value: '1.10' });
                column.push({ alien: 'right', value: '0.210' });
                column.push({ alien: 'center', value: 'OK' });
                page.columns.push(column);
            }
            result.push(page);
        }
        return result;
    };
    CalcSafetyFatigueMomentService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcSafetyFatigueMomentService);
    return CalcSafetyFatigueMomentService;
}());
export { CalcSafetyFatigueMomentService };
//# sourceMappingURL=calc-safety-fatigue-moment.service.js.map