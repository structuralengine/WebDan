import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputDesignPointsService } from './input-design-points.service';
var InputSectionForcesService = /** @class */ (function (_super) {
    tslib_1.__extends(InputSectionForcesService, _super);
    function InputSectionForcesService(points) {
        var _this = _super.call(this) || this;
        _this.points = points;
        _this.clear();
        return _this;
    }
    InputSectionForcesService.prototype.clear = function () {
        this.Mdatas = new Array();
        this.Vdatas = new Array();
    };
    InputSectionForcesService.prototype.default_m_column = function (m_no, p_name_ex) {
        var rows = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
        for (var i = 0; i < 10; i++) {
            var keyMd = 'case' + i + '_Md';
            var keyNd = 'case' + i + '_Nd';
            var tmp = { keyMd: null, keyNd: null };
            if (i === 7) {
                tmp['Nmax'] = null;
            }
            rows['case'].push(tmp);
        }
        return rows;
    };
    InputSectionForcesService.prototype.default_v_column = function (m_no, p_name_ex) {
        var rows = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
        for (var i = 0; i < 8; i++) {
            var keyVd = 'case' + i + '_Vd';
            var keyMd = 'case' + i + '_Md';
            var keyNd = 'case' + i + '_Nd';
            var tmp = { keyVd: null, keyMd: null, keyNd: null };
            rows['case'].push(tmp);
        }
        return rows;
    };
    InputSectionForcesService.prototype.getMdtableColumns = function () {
        var old_Mdatas = this.Mdatas.slice(0, this.Mdatas.length);
        this.Mdatas = new Array();
        var pp = this.points.position_list;
        var _loop_1 = function (p) {
            var p0 = p['positions'][0];
            var new_colum = old_Mdatas.find(function (value) {
                return value.m_no === p.m_no;
            });
            if (new_colum === undefined) {
                new_colum = this_1.default_v_column(p.m_no, p0.p_name_ex);
            }
            new_colum.p_name_ex = p0.p_name_ex;
            this_1.Mdatas.push(new_colum);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.points.position_list; _i < _a.length; _i++) {
            var p = _a[_i];
            _loop_1(p);
        }
        return this.Mdatas;
    };
    InputSectionForcesService.prototype.setMdtableColumns = function (Mtable_datas) {
        this.Mdatas = new Array();
        for (var _i = 0, Mtable_datas_1 = Mtable_datas; _i < Mtable_datas_1.length; _i++) {
            var data = Mtable_datas_1[_i];
            var new_colum = this.default_m_column(data.m_no, data.p_name_ex);
            for (var i = 0; i < new_colum['case'].length; i++) {
                var keyMd = 'case' + i + '_Md';
                var keyNd = 'case' + i + '_Nd';
                new_colum['case'][i].Md = data[keyMd];
                new_colum['case'][i].Nd = data[keyNd];
                if ('Nmax' in new_colum['case'][i]) {
                    var keyNmax = 'case' + i + '_Nmax';
                    new_colum['case'][i].Nmax = data[keyNmax];
                }
            }
            this.Mdatas.push(new_colum);
        }
    };
    InputSectionForcesService.prototype.getVdtableColumns = function () {
        var old_Vdatas = this.Vdatas.slice(0, this.Vdatas.length);
        this.Vdatas = new Array();
        var _loop_2 = function (p) {
            var p0 = p['positions'][0];
            var new_colum = old_Vdatas.find(function (value) {
                return value.m_no === p.m_no;
            });
            if (new_colum === undefined) {
                new_colum = this_2.default_m_column(p.m_no, p0.p_name_ex);
            }
            new_colum.p_name_ex = p0.p_name_ex;
            this_2.Vdatas.push(new_colum);
        };
        var this_2 = this;
        for (var _i = 0, _a = this.points.position_list; _i < _a.length; _i++) {
            var p = _a[_i];
            _loop_2(p);
        }
        return this.Vdatas;
    };
    InputSectionForcesService.prototype.setVdtableColumns = function (Vtable_datas) {
        this.Vdatas = new Array();
        for (var _i = 0, Vtable_datas_1 = Vtable_datas; _i < Vtable_datas_1.length; _i++) {
            var data = Vtable_datas_1[_i];
            var new_colum = this.default_v_column(data.m_no, data.p_name_ex);
            for (var i = 0; i < new_colum['case'].length; i++) {
                var keyVd = 'case' + i + '_Vd';
                var keyMd = 'case' + i + '_Md';
                var keyNd = 'case' + i + '_Nd';
                new_colum['case'][i].Vd = data[keyVd];
                new_colum['case'][i].Md = data[keyMd];
                new_colum['case'][i].Nd = data[keyNd];
            }
            this.Vdatas.push(new_colum);
        }
    };
    InputSectionForcesService.prototype.getDesignForce = function (type) {
        var result = new Array();
        var tempTable;
        var caseNo = new Array();
        switch (type) {
            case '安全性（破壊）曲げモーメント':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(7);
                break;
            case '安全性（破壊）せん断力':
                result.push('ShearForce');
                tempTable = this.Vdatas;
                caseNo.push(5);
                break;
            case '安全性（疲労破壊）曲げモーメント':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(5); // 最小応力
                caseNo.push(6); // 最大応力
                break;
            case '安全性（疲労破壊）せん断力':
                result.push('ShearForce');
                tempTable = this.Vdatas;
                caseNo.push(3); // 最小応力
                caseNo.push(4); // 最大応力
                break;
            case '耐久性 曲げひび割れ':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(0); // 縁応力度検討用
                caseNo.push(1); // 鉄筋応力度検討用
                caseNo.push(2); // 永久荷重
                caseNo.push(3); // 変動荷重
                break;
            case '耐久性 せん断ひび割れ':
                result.push('ShearForce');
                tempTable = this.Vdatas;
                caseNo.push(0); // せん断ひび割れ検討判定用
                caseNo.push(1); // 永久荷重
                caseNo.push(2); // 変動荷重
                break;
            case '使用性 曲げひび割れ':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(0); // 縁応力度検討用
                caseNo.push(1); // 鉄筋応力度検討用
                caseNo.push(4); // 永久荷重
                caseNo.push(3); // 変動荷重
                break;
            case '復旧性（地震時以外）曲げモーメント':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(8);
                break;
            case '復旧性（地震時以外）せん断力':
                result.push('ShearForce');
                tempTable = this.Vdatas;
                caseNo.push(6);
                break;
            case '復旧性（地震時）曲げモーメント':
                result.push('Moment');
                tempTable = this.Mdatas;
                caseNo.push(9);
                break;
            case '復旧性（地震時）せん断力':
                result.push('ShearForce');
                tempTable = this.Vdatas;
                caseNo.push(7);
                break;
        }
        return result;
    };
    InputSectionForcesService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputDesignPointsService])
    ], InputSectionForcesService);
    return InputSectionForcesService;
}(InputDataService));
export { InputSectionForcesService };
//# sourceMappingURL=input-section-forces.service.js.map