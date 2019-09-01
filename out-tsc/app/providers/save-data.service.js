import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputBarsService } from './input-bars.service';
import { InputBasicInformationService } from './input-basic-information.service';
import { InputDesignPointsService } from './input-design-points.service';
import { InputFatiguesService } from './input-fatigues.service';
import { InputMembersService } from './input-members.service';
import { InputSafetyFactorsMaterialStrengthsService } from './input-safety-factors-material-strengths.service';
import { InputSectionForcesService } from './input-section-forces.service';
import { InputCalclationPrintService } from './input-calclation-print.service';
var SaveDataService = /** @class */ (function (_super) {
    tslib_1.__extends(SaveDataService, _super);
    function SaveDataService(bars, basic, points, fatigues, members, safety, force, calc) {
        var _this = _super.call(this) || this;
        _this.bars = bars;
        _this.basic = basic;
        _this.points = points;
        _this.fatigues = fatigues;
        _this.members = members;
        _this.safety = safety;
        _this.force = force;
        _this.calc = calc;
        return _this;
    }
    SaveDataService.prototype.clear = function () {
        this.pickup_filename = '';
        this.basic.clear();
        this.members.clear();
        this.points.clear();
        this.bars.clear();
        this.fatigues.clear();
        this.safety.clear();
    };
    // ピックアップファイルを読み込む
    SaveDataService.prototype.readPickUpData = function (str, filename) {
        try {
            var tmp = str.split('\n'); // 改行を区切り文字として行を要素とした配列を生成
            // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
            var pickup_data = {};
            var _loop_1 = function (i) {
                var line = tmp[i];
                if (line.trim().length === 0) {
                    return "continue";
                }
                var pickUpNo = 'pickUpNo:' + line.slice(0, 5).trim();
                var mark = line.slice(5, 10).trim();
                var memberNo = this_1.toNumber(line.slice(10, 15));
                var maxPickupCase = line.slice(15, 20).trim();
                var minPickupCase = line.slice(20, 25).trim();
                var p_name = line.slice(25, 30).trim();
                var position = this_1.toNumber(line.slice(30, 40));
                var maxMd = this_1.toNumber(line.slice(40, 50));
                var maxVd = this_1.toNumber(line.slice(50, 60));
                var maxNd = this_1.toNumber(line.slice(60, 70));
                var minMd = this_1.toNumber(line.slice(70, 80));
                var minVd = this_1.toNumber(line.slice(80, 90));
                var minNd = this_1.toNumber(line.slice(90, 100));
                if (pickUpNo in pickup_data === false) {
                    pickup_data[pickUpNo] = new Array();
                }
                var m = pickup_data[pickUpNo].find(function (value) {
                    return value.memberNo === memberNo;
                });
                if (m === undefined) {
                    m = { memberNo: memberNo, positions: [] };
                    pickup_data[pickUpNo].push(m);
                }
                var p = m['positions'].find(function (value) {
                    return value.p_name === p_name;
                });
                if (p === undefined) {
                    p = { p_name: p_name, position: position };
                    m['positions'].push(p);
                }
                if (mark in p === false) {
                    p[mark] = {};
                }
                p[mark]['max'] = { 'Md': maxMd, 'Vd': maxVd, 'Nd': maxNd, 'comb': maxPickupCase };
                p[mark]['min'] = { 'Md': minMd, 'Vd': minVd, 'Nd': minNd, 'comb': minPickupCase };
            };
            var this_1 = this;
            for (var i = 1; i < tmp.length; ++i) {
                _loop_1(i);
            }
            this.members.setPickUpData(pickup_data);
            this.points.setPickUpData(pickup_data);
            this.force.clear();
            this.pickup_filename = filename;
            this.pickup_data = pickup_data;
        }
        catch (_a) {
            this.pickup_filename = '';
            this.pickup_data = {};
        }
    };
    // ファイルに保存用データを生成
    SaveDataService.prototype.getInputText = function () {
        var jsonData = {};
        jsonData['pickup_filename'] = this.pickup_filename;
        jsonData['pickup_data'] = this.pickup_data;
        jsonData['pickup_moment_no'] = this.basic.pickup_moment_no;
        jsonData['pickup_shear_force_no'] = this.basic.pickup_shear_force_no;
        jsonData['specification1_selected'] = this.basic.specification1_selected; // 適用 に関する変数
        jsonData['specification2_selected'] = this.basic.specification2_selected; // 仕様 に関する変数
        jsonData['conditions_list'] = this.basic.conditions_list; // 設計条件
        jsonData['member_list'] = this.members.member_list; // 部材情報
        jsonData['position_list'] = this.points.position_list; // 着目点情報
        jsonData['bar_list'] = this.bars.bar_list; // 鉄筋情報
        jsonData['fatigue_list'] = this.fatigues.fatigue_list; // 疲労情報
        jsonData['safety_factor_material_strengths'] = this.safety.safety_factor_material_strengths_list; // 安全係数情報
        jsonData['manual_moment_force'] = this.force.Mdatas;
        jsonData['manual_shear_force'] = this.force.Vdatas;
        jsonData['print_selected'] = this.calc.print_selected;
        // string 型にする
        var result = JSON.stringify(jsonData);
        return result;
    };
    SaveDataService.prototype.readInputData = function (inputText) {
        this.clear();
        var jsonData = JSON.parse(inputText);
        this.pickup_filename = jsonData['pickup_filename'];
        this.pickup_data = jsonData['pickup_data'];
        this.basic.pickup_moment_no = jsonData['pickup_moment_no'];
        this.basic.pickup_shear_force_no = jsonData['pickup_shear_force_no'];
        this.basic.specification1_selected = jsonData['specification1_selected']; // 適用 に関する変数
        this.basic.specification2_selected = jsonData['specification2_selected']; // 仕様 に関する変数
        this.basic.conditions_list = jsonData['conditions_list']; // 設計条件
        this.members.member_list = jsonData['member_list']; // 部材情報
        this.points.position_list = jsonData['position_list']; // 着目点情報
        this.bars.bar_list = jsonData['bar_list']; // 鉄筋情報
        this.fatigues.fatigue_list = jsonData['fatigue_list']; // 疲労情報
        this.safety.safety_factor_material_strengths_list = jsonData['safety_factor_material_strengths']; // 安全係数情報
        this.force.Mdatas = jsonData['manual_moment_force'];
        this.force.Vdatas = jsonData['manual_shear_force'];
        this.calc.print_selected = jsonData['print_selected'];
    };
    SaveDataService.prototype.getCalcrateText = function (mode, Properties) {
        if (mode === void 0) { mode = 'file'; }
        if (Properties === void 0) { Properties = {}; }
        return 'aa';
    };
    SaveDataService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputBarsService,
            InputBasicInformationService,
            InputDesignPointsService,
            InputFatiguesService,
            InputMembersService,
            InputSafetyFactorsMaterialStrengthsService,
            InputSectionForcesService,
            InputCalclationPrintService])
    ], SaveDataService);
    return SaveDataService;
}(InputDataService));
export { SaveDataService };
//# sourceMappingURL=save-data.service.js.map