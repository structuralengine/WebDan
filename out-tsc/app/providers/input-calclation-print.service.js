import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputMembersService } from './input-members.service';
var InputCalclationPrintService = /** @class */ (function () {
    function InputCalclationPrintService(members) {
        this.members = members;
        this.print_selected = {
            'print_calculate_checked': false,
            'print_section_force_checked': false,
            'print_summary_table_checked': false,
            'calculate_moment_checked': false,
            'calculate_shear_force': false
        };
        this.calc_checked = new Array();
    }
    InputCalclationPrintService.prototype.getColumnData = function () {
        var result = new Array();
        var groups = this.members.getGroupeList();
        for (var i = 0; i < groups.length; i++) {
            var checked = false;
            if (i < this.calc_checked.length) {
                checked = this.calc_checked[i];
            }
            result.push({
                'checked': checked,
                'g_name': groups[i][0].g_name
            });
        }
        return result;
    };
    InputCalclationPrintService.prototype.setColumnData = function (ColumnData) {
        this.calc_checked = new Array();
        for (var _i = 0, ColumnData_1 = ColumnData; _i < ColumnData_1.length; _i++) {
            var data = ColumnData_1[_i];
            this.calc_checked.push(data.calc_checked);
        }
    };
    InputCalclationPrintService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputMembersService])
    ], InputCalclationPrintService);
    return InputCalclationPrintService;
}());
export { InputCalclationPrintService };
//# sourceMappingURL=input-calclation-print.service.js.map