import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputDesignPointsService } from './input-design-points.service';
var InputFatiguesService = /** @class */ (function (_super) {
    tslib_1.__extends(InputFatiguesService, _super);
    function InputFatiguesService(points) {
        var _this = _super.call(this) || this;
        _this.points = points;
        _this.clear();
        return _this;
    }
    InputFatiguesService.prototype.clear = function () {
        // 疲労強度入力画面に関する初期化
        this.fatigue_list = new Array();
    };
    /// <summary>
    /// fatigues の
    /// g_no でグループ化した配列のデータを返す関数
    /// </summary>
    InputFatiguesService.prototype.getFatiguesColumns = function () {
        var result = new Array();
        var old_fatigue_list = this.fatigue_list.slice(0, this.fatigue_list.length);
        this.fatigue_list = new Array();
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
                    var b = old_fatigue_list.find(function (value) {
                        return (value.m_no === members.m_no && value.p_name === position.p_name);
                    });
                    if (b === undefined) {
                        b = this_1.default_fatigue(members.m_no, position.p_name);
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
    /// fatigues の データを 保存する関数
    /// </summary>
    InputFatiguesService.prototype.setFatiguesColumns = function (table_datas) {
        this.fatigue_list = new Array();
        for (var _i = 0, table_datas_1 = table_datas; _i < table_datas_1.length; _i++) {
            var groupe = table_datas_1[_i];
            for (var i = 0; i < groupe.length; i += 2) {
                var column1 = groupe[i];
                var column2 = groupe[i + 1];
                var f = this.default_fatigue(column1.m_no, column1.p_name);
                f.p_name_ex = column1.p_name_ex;
                f.b = column1.bh;
                f.h = column2.bh;
                f.title1 = column1.design_point_id;
                f['M1'].SA = column1.M_SA;
                f['M1'].SB = column1.M_SB;
                f['M1'].NA06 = column1.M_NA06;
                f['M1'].NB06 = column1.M_NB06;
                f['M1'].NA12 = column1.M_NA12;
                f['M1'].NB12 = column1.M_NB12;
                f['M1'].A = column1.M_A;
                f['M1'].B = column1.M_B;
                f['V1'].SA = column1.V_SA;
                f['V1'].SB = column1.V_SB;
                f['V1'].NA06 = column1.V_NA06;
                f['V1'].NB06 = column1.V_NB06;
                f['V1'].NA12 = column1.V_NA12;
                f['V1'].NB12 = column1.V_NB12;
                f['V1'].A = column1.V_A;
                f['V1'].B = column1.V_B;
                f.title2 = column2.design_point_id;
                f['M2'].SA = column2.M_SA;
                f['M2'].SB = column2.M_SB;
                f['M2'].NA06 = column2.M_NA06;
                f['M2'].NB06 = column2.M_NB06;
                f['M2'].NA12 = column2.M_NA12;
                f['M2'].NB12 = column2.M_NB12;
                f['M2'].A = column2.M_A;
                f['M2'].B = column2.M_B;
                f['V2'].SA = column2.V_SA;
                f['V2'].SB = column2.V_SB;
                f['V2'].NA06 = column2.V_NA06;
                f['V2'].NB06 = column2.V_NB06;
                f['V2'].NA12 = column2.V_NA12;
                f['V2'].NB12 = column2.V_NB12;
                f['V2'].A = column2.V_A;
                f['V2'].B = column2.V_B;
                this.fatigue_list.push(f);
            }
        }
    };
    // 疲労情報
    InputFatiguesService.prototype.default_fatigue = function (id, p_name) {
        return {
            'm_no': id,
            'p_name': p_name,
            'p_name_ex': null,
            'b': null,
            'h': null,
            'title1': '上',
            'M1': this.default_fatigue_coefficient(),
            'V1': this.default_fatigue_coefficient(),
            'title2': '下',
            'M2': this.default_fatigue_coefficient(),
            'V2': this.default_fatigue_coefficient()
        };
    };
    InputFatiguesService.prototype.default_fatigue_coefficient = function () {
        return {
            'SA': null,
            'SB': null,
            'NA06': null,
            'NB06': null,
            'NA12': null,
            'NB12': null,
            'A': null,
            'B': null
        };
    };
    InputFatiguesService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputDesignPointsService])
    ], InputFatiguesService);
    return InputFatiguesService;
}(InputDataService));
export { InputFatiguesService };
//# sourceMappingURL=input-fatigues.service.js.map