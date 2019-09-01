import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { ResultDataService } from './result-data.service';
import { Injectable } from '@angular/core';
var CalcServiceabilityShearForceService = /** @class */ (function () {
    function CalcServiceabilityShearForceService(save, calc) {
        this.save = save;
        this.calc = calc;
    }
    // 設計断面力の集計
    // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
    // 手入力モード（this.save.isManual() === true）の場合は空の配列を返す
    CalcServiceabilityShearForceService.prototype.setDesignForces = function () {
        var pickupNoList = new Array();
        pickupNoList.push(this.save.basic.pickup_moment_no[0]); // せん断ひび割れ検討判定用
        pickupNoList.push(this.save.basic.pickup_moment_no[1]); // 永久荷重
        pickupNoList.push(this.save.basic.pickup_moment_no[2]); // 変動荷重
        this.DesignForceList = this.calc.getDesignForceList('ShearForce', pickupNoList);
        var result = new Array();
        if (this.save.isManual() === true) {
            return result;
        }
        return result;
    };
    CalcServiceabilityShearForceService.prototype.getServiceabilityPages = function () {
        var result = new Array();
        for (var i = 0; i < 1; i++) {
            var page = { caption: '耐久性 せん断ひび割れの照査結果', columns: new Array() };
            for (var c = 0; c < 5; c++) {
                var column = new Array();
                column.push({ alien: 'center', value: '1部材(0.600)' });
                column.push({ alien: 'center', value: '壁前面(上側)' });
                column.push({ alien: 'center', value: '1' });
                column.push({ alien: 'right', value: '1000' });
                column.push({ alien: 'right', value: '3000' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'right', value: '6353.6' });
                column.push({ alien: 'center', value: 'D32-8 本' });
                column.push({ alien: 'right', value: '82.0' });
                column.push({ alien: 'right', value: '12707.2' });
                column.push({ alien: 'center', value: 'D32-16 本' });
                column.push({ alien: 'right', value: '114.0' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'right', value: '24.0' });
                column.push({ alien: 'right', value: '1.30' });
                column.push({ alien: 'right', value: '18.5' });
                column.push({ alien: 'right', value: '390' });
                column.push({ alien: 'right', value: '1.00' });
                column.push({ alien: 'right', value: '390' });
                column.push({ alien: 'right', value: '506.8' });
                column.push({ alien: 'center', value: 'D32-4 本' });
                column.push({ alien: 'right', value: '345' });
                column.push({ alien: 'right', value: '90' });
                column.push({ alien: 'right', value: '250' });
                column.push({ alien: 'right', value: '501.7' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '455.2' });
                column.push({ alien: 'right', value: '0.550' });
                column.push({ alien: 'right', value: '1.117' });
                column.push({ alien: 'right', value: '0.00315' });
                column.push({ alien: 'right', value: '0.681' });
                column.push({ alien: 'right', value: '503.9' });
                column.push({ alien: 'right', value: '18.1' });
                column.push({ alien: 'right', value: '1.072' });
                column.push({ alien: 'right', value: '1.00' });
                column.push({ alien: 'right', value: '503.9' });
                column.push({ alien: 'center', value: '89.3 < 215.6' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: 'OK' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: '-' });
                column.push({ alien: 'center', value: 'OK' });
                page.columns.push(column);
            }
            result.push(page);
        }
        return result;
    };
    CalcServiceabilityShearForceService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService,
            ResultDataService])
    ], CalcServiceabilityShearForceService);
    return CalcServiceabilityShearForceService;
}());
export { CalcServiceabilityShearForceService };
//# sourceMappingURL=calc-serviceability-shear-force.service.js.map