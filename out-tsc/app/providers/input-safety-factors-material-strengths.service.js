import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputBasicInformationService } from './input-basic-information.service';
import { InputMembersService } from './input-members.service';
var InputSafetyFactorsMaterialStrengthsService = /** @class */ (function (_super) {
    tslib_1.__extends(InputSafetyFactorsMaterialStrengthsService, _super);
    function InputSafetyFactorsMaterialStrengthsService(basic, members) {
        var _this = _super.call(this) || this;
        _this.basic = basic;
        _this.members = members;
        _this.clear();
        return _this;
    }
    InputSafetyFactorsMaterialStrengthsService.prototype.clear = function () {
        this.safety_factor_material_strengths_list = new Array();
        this.initSpecificationTitles();
    };
    InputSafetyFactorsMaterialStrengthsService.prototype.getGroupeList = function () {
        return this.members.getGroupeList();
    };
    InputSafetyFactorsMaterialStrengthsService.prototype.getTableColumns = function (g_no) {
        var result = this.safety_factor_material_strengths_list.find(function (value) {
            return value.g_no === g_no;
        });
        if (result === undefined) {
            result = this.default_safety_factor_material_strengths(g_no);
            this.safety_factor_material_strengths_list.push(result);
        }
        result['safety_factor_title'] = this.safety_factor_title;
        result['pile_factor_list'] = this.pile_factor_list;
        return result;
    };
    InputSafetyFactorsMaterialStrengthsService.prototype.setTableColumns = function (data) {
        this.safety_factor_material_strengths_list = new Array();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var current_data = data_1[_i];
            var target = { 'g_no': current_data['g_no'] };
            // 安全係数を保存用変数に格納する
            target['safety_factor'] = new Array();
            for (var _a = 0, _b = current_data['safety_factor']; _a < _b.length; _a++) {
                var current_safety_factor = _b[_a];
                var temp = {};
                for (var _c = 0, _d = Object.keys(current_safety_factor); _c < _d.length; _c++) {
                    var key = _d[_c];
                    temp[key] = this.toNumber(current_safety_factor[key]);
                }
                target['safety_factor'].push(temp);
            }
            // 鉄筋強度を保存用変数に格納する
            target['material_steel'] = new Array();
            for (var _e = 0, _f = current_data['material_steel']; _e < _f.length; _e++) {
                var current_steel = _f[_e];
                var temp = {};
                for (var _g = 0, _h = Object.keys(current_steel); _g < _h.length; _g++) {
                    var key = _h[_g];
                    temp[key] = this.toNumber(current_steel[key]);
                }
                target['material_steel'].push(temp);
            }
            // コンクリート強度を保存用変数に格納する
            target['material_concrete'] = this.default_material_concrete();
            var current_concrete = current_data['material_concrete'];
            target['material_concrete'].fck = this.toNumber(current_concrete[0].value);
            target['material_concrete'].dmax = this.toNumber(current_concrete[1].value);
            // 杭の施工条件を保存用変数に格納する
            var current_pile_factor_selected = current_data['pile_factor_selected'];
            target['pile_factor_selected'] = current_pile_factor_selected;
            // 保存用変数に格納する
            this.safety_factor_material_strengths_list.push(target);
        }
    };
    InputSafetyFactorsMaterialStrengthsService.prototype.default_safety_factor_material_strengths = function (g_no) {
        var result = {
            'g_no': g_no,
            'safety_factor': this.default_safety_factor(),
            'material_steel': this.default_material_steel(),
            'material_concrete': this.default_material_concrete(),
            'pile_factor_selected': this.pile_factor_list[0].id
        };
        return result;
    };
    // 材料強度情報
    InputSafetyFactorsMaterialStrengthsService.prototype.default_safety_factor = function () {
        return [
            {
                'M_rc': 1.00,
                'M_rs': 1.00,
                'M_rbs': 1.00,
                'V_rc': 1.00,
                'V_rs': 1.00,
                'V_rbc': 1.00,
                'V_rbs': 1.00,
                'V_rbv': null,
                'ri': 1.00,
                'range': 1
            },
            {
                'M_rc': 1.30,
                'M_rs': 1.05,
                'M_rbs': 1.10,
                'V_rc': 1.30,
                'V_rs': 1.05,
                'V_rbc': 1.30,
                'V_rbs': 1.10,
                'V_rbv': null,
                'ri': 1.10,
                'range': 2
            },
            {
                'M_rc': 1.30,
                'M_rs': 1.00,
                'M_rbs': 1.10,
                'V_rc': 1.30,
                'V_rs': 1.00,
                'V_rbc': 1.30,
                'V_rbs': 1.10,
                'V_rbv': 1.20,
                'ri': 1.20,
                'range': 3
            },
            {
                'M_rc': 1.30,
                'M_rs': 1.00,
                'M_rbs': 1.00,
                'V_rc': 1.30,
                'V_rs': 1.00,
                'V_rbc': 1.30,
                'V_rbs': 1.00,
                'V_rbv': 1.20,
                'ri': 1.20,
                'range': 3
            },
            {
                'M_rc': 1.30,
                'M_rs': 1.00,
                'M_rbs': 1.00,
                'V_rc': 1.30,
                'V_rs': 1.00,
                'V_rbc': 1.30,
                'V_rbs': 1.00,
                'V_rbv': 1.20,
                'ri': 1.00,
                'range': 3
            }
        ];
    };
    // 材料強度情報
    InputSafetyFactorsMaterialStrengthsService.prototype.default_material_steel = function () {
        return [
            { fsy1: 29, fsu1: 29 },
            { fsy1: 345, fsy2: 390, fsu1: 490, fsu2: 560 },
            { fsy1: 345, fsy2: 390, fsu1: 490, fsu2: 560 },
            { fsy1: 345, fsy2: 390, fsu1: 490, fsu2: 560 }
        ];
    };
    InputSafetyFactorsMaterialStrengthsService.prototype.default_material_concrete = function () {
        return {
            'fck': 24,
            'dmax': 25
        };
    };
    /// <summary>
    /// specification1_selected によって変わる項目の設定
    /// </summary>
    InputSafetyFactorsMaterialStrengthsService.prototype.initSpecificationTitles = function () {
        switch (this.basic.specification1_selected) {
            case 0: // 鉄道
                this.safety_factor_title = [
                    '耐久性, 使用性',
                    '安全性 （疲労破壊）',
                    '安全性 （破壊）',
                    '復旧性 （損傷）地震時以外',
                    '復旧性 （損傷）地震時'
                ];
                this.pile_factor_list = [
                    { id: 'pile-000', title: '使用しない', rfck: 1.0, rfbok: 1.0, rEc: 1.0, rVcd: 1.0 },
                    { id: 'pile-001', title: '泥水比重1.04以下', rfck: 0.8, rfbok: 0.7, rEc: 0.8, rVcd: 0.9 },
                    { id: 'pile-002', title: '自然泥水, 泥水比重1.10以下', rfck: 0.7, rfbok: 0.6, rEc: 0.8, rVcd: 0.9 },
                    { id: 'pile-003', title: 'ベントナイト泥水', rfck: 0.6, rfbok: 0.5, rEc: 0.7, rVcd: 0.8 },
                    { id: 'pile-004', title: '気中施工', rfck: 0.9, rfbok: 0.9, rEc: 0.9, rVcd: 1.0 },
                ];
                break;
            case 1: // 道路
                this.safety_factor_title = new Array();
                this.pile_factor_list = new Array();
                break;
            default:
                return;
        }
    };
    InputSafetyFactorsMaterialStrengthsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputBasicInformationService,
            InputMembersService])
    ], InputSafetyFactorsMaterialStrengthsService);
    return InputSafetyFactorsMaterialStrengthsService;
}(InputDataService));
export { InputSafetyFactorsMaterialStrengthsService };
//# sourceMappingURL=input-safety-factors-material-strengths.service.js.map