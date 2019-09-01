import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { Injectable } from '@angular/core';
var CalcRestorabilityMomentService = /** @class */ (function () {
    function CalcRestorabilityMomentService(save, calc) {
        this.save = save;
        this.calc = calc;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcRestorabilityMomentService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[8]); // ピックアップNoは 曲げの8番目に保存されている
        this.DesignForceList = this.calc.getDesignForceList('Moment', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcRestorabilityMomentService.prototype.getRestorabilityPages = function (title) {
        if (title === void 0) { title = '復旧性（地震時以外）曲げモーメントの照査結果'; }
        var result = new Array();
        for (var i = 0; i < 1; i++) {
            var page = { caption: title, columns: new Array() };
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
                column.push({ alien: 'right', value: '0.00048' });
                column.push({ alien: 'right', value: '0.00195' });
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
    CalcRestorabilityMomentService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcRestorabilityMomentService);
    return CalcRestorabilityMomentService;
}());
export { CalcRestorabilityMomentService };
//# sourceMappingURL=calc-restorability-moment.service.js.map