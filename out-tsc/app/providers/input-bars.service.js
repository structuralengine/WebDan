import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputDesignPointsService } from './input-design-points.service';
var InputBarsService = /** @class */ (function (_super) {
    tslib_1.__extends(InputBarsService, _super);
    function InputBarsService(points) {
        var _this = _super.call(this) || this;
        _this.points = points;
        _this.clear();
        return _this;
    }
    InputBarsService.prototype.clear = function () {
        this.bar_list = new Array();
    };
    /// <summary>
    /// bars の
    /// g_no でグループ化した配列のデータを返す関数
    /// </summary>
    InputBarsService.prototype.getBarsColumns = function () {
        var result = new Array();
        var old_bar_list = this.bar_list.slice(0, this.bar_list.length);
        this.bar_list = new Array();
        var design_points = this.points.getDesignPointColumns();
        for (var _i = 0, design_points_1 = design_points; _i < design_points_1.length; _i++) {
            var groupe = design_points_1[_i];
            var member_list = new Array();
            var _loop_1 = function (members) {
                var position_list = { g_name: members['g_name'], g_no: members['g_no'], positions: new Array() };
                var _loop_2 = function (position) {
                    if (position['isMyCalc'] !== true && position['isVyCalc'] !== true
                        && position['isMzCalc'] !== true && position['isVzCalc'] !== true) {
                        return "continue";
                    }
                    var b = old_bar_list.find(function (value) {
                        return (value.m_no === members.m_no && value.p_name === position.p_name);
                    });
                    if (b === undefined) {
                        b = this_1.default_bars(members.m_no, position.p_name);
                    }
                    b.p_name_ex = position['p_name_ex'];
                    b.b = members['B'];
                    b.h = members['H'];
                    position_list['positions'].push(b);
                };
                for (var _i = 0, _a = members['positions']; _i < _a.length; _i++) {
                    var position = _a[_i];
                    _loop_2(position);
                }
                member_list.push(position_list);
            };
            var this_1 = this;
            for (var _a = 0, groupe_1 = groupe; _a < groupe_1.length; _a++) {
                var members = groupe_1[_a];
                _loop_1(members);
            }
            result.push(member_list);
        }
        return result;
    };
    /// <summary>
    /// bars の データを 保存する関数
    /// </summary>
    InputBarsService.prototype.setBarsColumns = function (table_datas) {
        this.bar_list = new Array();
        for (var _i = 0, table_datas_1 = table_datas; _i < table_datas_1.length; _i++) {
            var groupe = table_datas_1[_i];
            for (var i = 0; i < groupe.length; i += 2) {
                var column1 = groupe[i];
                var column2 = groupe[i + 1];
                var b = this.default_bars(column1.m_no, column1.p_name);
                b.p_name_ex = column1.p_name_ex;
                b.b = column1.bh;
                b.h = column2.bh;
                b.haunch_M = column1.haunch_height;
                b.haunch_V = column2.haunch_height;
                b['rebar1'].title = column1.design_point_id;
                b['rebar1'].rebar_dia = column1.rebar_dia;
                b['rebar1'].rebar_n = column1.rebar_n;
                b['rebar1'].rebar_cover = column1.rebar_cover;
                b['rebar1'].rebar_lines = column1.rebar_lines;
                b['rebar1'].rebar_space = column1.rebar_space;
                b['rebar1'].rebar_ss = column1.rebar_ss;
                b['rebar1'].cos = column1.cos;
                b['rebar1'].enable = column1.enable;
                b['rebar2'].title = column2.design_point_id;
                b['rebar2'].rebar_dia = column2.rebar_dia;
                b['rebar2'].rebar_n = column2.rebar_n;
                b['rebar2'].rebar_cover = column2.rebar_cover;
                b['rebar2'].rebar_lines = column2.rebar_lines;
                b['rebar2'].rebar_space = column2.rebar_space;
                b['rebar2'].rebar_ss = column2.rebar_ss;
                b['rebar2'].cos = column2.cos;
                b['rebar2'].enable = column2.enable;
                b['sidebar'].side_dia = column1.side_dia;
                b['sidebar'].side_n = column1.side_n;
                b['sidebar'].side_cover = column1.side_cover;
                b['sidebar'].side_ss = column1.side_ss;
                b['starrup'].stirrup_dia = column1.stirrup_dia;
                b['starrup'].stirrup_n = column1.stirrup_n;
                b['starrup'].stirrup_ss = column1.stirrup_ss;
                b['bend'].bending_dia = column1.bending_dia;
                b['bend'].bending_n = column1.bending_n;
                b['bend'].bending_ss = column1.bending_ss;
                b['bend'].bending_angle = column1.bending_angle;
                b.tan = column1.haunch_height;
                this.bar_list.push(b);
            }
        }
    };
    // 鉄筋情報
    InputBarsService.prototype.default_bars = function (id, p_name) {
        return {
            'm_no': id,
            'p_name': p_name,
            'p_name_ex': null,
            'b': null,
            'h': null,
            'haunch_M': null,
            'haunch_V': null,
            'rebar1': this.default_rebar('上'),
            'rebar2': this.default_rebar('下'),
            'sidebar': this.default_sidebar(),
            'starrup': this.default_starrup(),
            'bend': this.default_bend(),
            'tan': null
        };
    };
    InputBarsService.prototype.default_rebar = function (title) {
        return {
            'title': title,
            'rebar_dia': null,
            'rebar_n': null,
            'rebar_cover': null,
            'rebar_lines': null,
            'rebar_space': null,
            'rebar_ss': null,
            'cos': null,
            'enable': null
        };
    };
    InputBarsService.prototype.default_sidebar = function () {
        return {
            'side_dia': null,
            'side_n': null,
            'side_cover': null,
            'side_ss': null
        };
    };
    InputBarsService.prototype.default_starrup = function () {
        return {
            'stirrup_dia': null,
            'stirrup_n': null,
            'stirrup_ss': null
        };
    };
    InputBarsService.prototype.default_bend = function () {
        return {
            'bending_dia': null,
            'bending_n': null,
            'bending_ss': null,
            'bending_angle': null
        };
    };
    InputBarsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputDesignPointsService])
    ], InputBarsService);
    return InputBarsService;
}(InputDataService));
export { InputBarsService };
//# sourceMappingURL=input-bars.service.js.map