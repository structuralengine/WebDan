import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputSectionForcesService } from '../../providers/input-section-forces.service';
var SectionForcesComponent = /** @class */ (function () {
    function SectionForcesComponent(input) {
        this.input = input;
        this.table_settings = {
            beforeChange: function (source, changes) { }
        };
    }
    SectionForcesComponent.prototype.ngOnInit = function () {
        var height = this.ht_container.nativeElement.offsetHeight;
        this.hottable_height = height - 250;
        // 曲げモーメントの初期化
        this.Mtable_datas = new Array();
        for (var _i = 0, _a = this.input.getMdtableColumns(); _i < _a.length; _i++) {
            var data = _a[_i];
            var column = { 'm_no': data['m_no'] };
            column['p_name_ex'] = data['p_name_ex'];
            var caseList = data['case'];
            for (var i = 0; i < caseList.length; i++) {
                var keyMd = 'case' + i + '_Md';
                var keyNd = 'case' + i + '_Nd';
                column[keyMd] = caseList[i].Md;
                column[keyNd] = caseList[i].Nd;
                if ('Nmax' in caseList[i]) {
                    var keyNmax = 'case' + i + '_Nmax';
                    column[keyNmax] = caseList[i].Nmax;
                }
            }
            this.Mtable_datas.push(column);
        }
        // せん断力の初期化
        this.Vtable_datas = new Array();
        for (var _b = 0, _c = this.input.getVdtableColumns(); _b < _c.length; _b++) {
            var data = _c[_b];
            var column = { 'm_no': data['m_no'] };
            column['p_name_ex'] = data['p_name_ex'];
            var caseList = data['case'];
            for (var i = 0; i < caseList.length; i++) {
                var keyVd = 'case' + i + '_Md';
                var keyMd = 'case' + i + '_Md';
                var keyNd = 'case' + i + '_Nd';
                column[keyVd] = caseList[i].Vd;
                column[keyMd] = caseList[i].Md;
                column[keyNd] = caseList[i].Nd;
            }
            this.Vtable_datas.push(column);
        }
    };
    // tslint:disable-next-line: use-life-cycle-interface
    SectionForcesComponent.prototype.ngOnDestroy = function () {
        this.input.setMdtableColumns(this.Mtable_datas);
        this.input.setVdtableColumns(this.Vtable_datas);
    };
    tslib_1.__decorate([
        ViewChild('ht_container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], SectionForcesComponent.prototype, "ht_container", void 0);
    SectionForcesComponent = tslib_1.__decorate([
        Component({
            selector: 'app-section-forces',
            templateUrl: './section-forces.component.html',
            styleUrls: ['./section-forces.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputSectionForcesService])
    ], SectionForcesComponent);
    return SectionForcesComponent;
}());
export { SectionForcesComponent };
//# sourceMappingURL=section-forces.component.js.map