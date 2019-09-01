import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputCalclationPrintService } from '../../providers/input-calclation-print.service';
import { SaveDataService } from '../../providers/save-data.service';
import { UserInfoService } from '../../providers/user-info.service';
var CalculationPrintComponent = /** @class */ (function () {
    function CalculationPrintComponent(input, save, router, user) {
        this.input = input;
        this.save = save;
        this.router = router;
        this.user = user;
        this.table_settings = {
            beforeChange: function (source, changes) {
            },
            afterChange: function (hotInstance, changes, source) {
            }
        };
    }
    CalculationPrintComponent.prototype.ngOnInit = function () {
        this.isManual = this.save.isManual();
        this.print_calculate_checked = this.input.print_selected.print_calculate_checked;
        this.print_section_force_checked = this.input.print_selected.print_section_force_checked;
        this.print_summary_table_checked = this.input.print_selected.print_summary_table_checked;
        this.calculate_moment_checked = this.input.print_selected.calculate_moment_checked;
        this.calculate_shear_force_checked = this.input.print_selected.calculate_shear_force;
        this.table_datas = new Array();
        for (var _i = 0, _a = this.input.getColumnData(); _i < _a.length; _i++) {
            var data = _a[_i];
            this.table_datas.push({
                'calc_checked': data.checked,
                'g_name': data.g_name
            });
        }
    };
    // tslint:disable-next-line: use-life-cycle-interface
    CalculationPrintComponent.prototype.ngOnDestroy = function () {
        this.input.print_selected.print_calculate_checked = this.print_calculate_checked;
        this.input.print_selected.print_section_force_checked = this.print_section_force_checked;
        this.input.print_selected.print_summary_table_checked = this.print_summary_table_checked;
        this.input.print_selected.calculate_moment_checked = this.calculate_moment_checked;
        this.input.print_selected.calculate_shear_force = this.calculate_shear_force_checked;
        this.input.setColumnData(this.table_datas);
    };
    // 計算開始
    CalculationPrintComponent.prototype.onClick = function () {
        if (this.user.loggedIn === false) {
            window.alert('計算する前に ログインしてください');
            // return;
        }
        this.router.navigate(['/result-viewer']);
    };
    CalculationPrintComponent = tslib_1.__decorate([
        Component({
            selector: 'app-calculation-print',
            templateUrl: './calculation-print.component.html',
            styleUrls: ['./calculation-print.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputCalclationPrintService,
            SaveDataService,
            Router,
            UserInfoService])
    ], CalculationPrintComponent);
    return CalculationPrintComponent;
}());
export { CalculationPrintComponent };
//# sourceMappingURL=calculation-print.component.js.map