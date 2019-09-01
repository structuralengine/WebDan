import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { Injectable } from '@angular/core';
var CalcSafetyMomentService = /** @class */ (function () {
    function CalcSafetyMomentService(save, calc) {
        this.save = save;
        this.calc = calc;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcSafetyMomentService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[7]); // ピックアップNoは 曲げの7番目に保存されている
        this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcSafetyMomentService.prototype.getSafetyPages = function () {
        var result = new Array();
        for (var i = 0; i < 1; i++) {
            var page = { caption: '安全性（破壊）曲げモーメントの照査結果', columns: new Array() };
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
                column.push({ alien: 'right', value: '501.7' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '0.00350' });
                column.push({ alien: 'right', value: '0.02168' });
                column.push({ alien: 'right', value: '572.1' });
                column.push({ alien: 'right', value: '7420.2' });
                column.push({ alien: 'right', value: '1.00' });
                column.push({ alien: 'right', value: '7420.2' });
                column.push({ alien: 'right', value: '1.20' });
                column.push({ alien: 'right', value: '0.081' });
                column.push({ alien: 'center', value: 'OK' });
                page.columns.push(column);
            }
            result.push(page);
        }
        return result;
    };
    CalcSafetyMomentService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcSafetyMomentService);
    return CalcSafetyMomentService;
}());
export { CalcSafetyMomentService };
//# sourceMappingURL=calc-safety-moment.service.js.map