import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { InputSafetyFactorsMaterialStrengthsService } from '../../providers/input-safety-factors-material-strengths.service';
var SafetyFactorsMaterialStrengthsComponent = /** @class */ (function () {
    function SafetyFactorsMaterialStrengthsComponent(input) {
        var _this = this;
        this.input = input;
        this.safety_factors_table_settings = {
            beforeChange: function (source, changes) {
                try {
                    for (var i = 0; i < changes.length; i++) {
                        switch (changes[i][1]) {
                            case 'range':
                                var value = _this.input.toNumber(changes[i][3]);
                                if (value === null) {
                                    changes[i][3] = changes[i][2]; // 入力も元に戻す
                                }
                                else {
                                    switch (value) {
                                        case 1:
                                            changes[i][3] = "引張鉄筋";
                                            break;
                                        case 2:
                                            changes[i][3] = "引張＋圧縮";
                                            break;
                                        case 3:
                                            changes[i][3] = "全周鉄筋";
                                            break;
                                        default:
                                            changes[i][3] = changes[i][2]; // 入力も元に戻す
                                    }
                                }
                                break;
                            default:
                            //何もしない
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        };
        this.steel_strength_table_settings = {
            beforeChange: function (source, changes, hotInstance) {
                try {
                    for (var i = 0; i < changes.length; i++) {
                        if (changes[i][0] === 0) // split
                         {
                            switch (changes[i][1]) {
                                case 'fsy1':
                                    var next_fsy2 = _this.input.getNextRebar(changes[i][3]);
                                    if (next_fsy2 !== undefined) {
                                        source.setDataAtCell(changes[i][0], 2, 'D' + next_fsy2.D + '以下', hotInstance);
                                        changes[i][3] = 'D' + changes[i][3] + '以上';
                                    }
                                    break;
                                case 'fsy2':
                                    var next_fsy1 = _this.input.getPreviousRebar(changes[i][3]);
                                    if (next_fsy1 !== undefined) {
                                        source.setDataAtCell(changes[i][0], 1, 'D' + next_fsy1.D + '以上', hotInstance);
                                        changes[i][3] = 'D' + changes[i][3] + '以下';
                                    }
                                    break;
                                case 'fsu1':
                                    var next_fsu2 = _this.input.getNextRebar(changes[i][3]);
                                    if (next_fsu2 !== undefined) {
                                        source.setDataAtCell(changes[i][0], 4, 'D' + next_fsu2.D + '以下', hotInstance);
                                        changes[i][3] = 'D' + changes[i][3] + '以上';
                                    }
                                    break;
                                case 'fsu2':
                                    var next_fsu1 = _this.input.getPreviousRebar(changes[i][3]);
                                    if (next_fsu1 !== undefined) {
                                        source.setDataAtCell(changes[i][0], 3, 'D' + next_fsu1.D + '以上', hotInstance);
                                        changes[i][3] = 'D' + changes[i][3] + '以下';
                                    }
                                    break;
                                default:
                                //何もしない
                            }
                        }
                        else {
                            var value = _this.input.toNumber(changes[i][3]);
                            if (value === null) {
                                changes[i][3] = changes[i][2];
                            }
                            else {
                                changes[i][3] = value;
                            }
                        }
                    }
                    for (var i = 0; i < changes.length; i++) {
                        switch (changes[i][1]) {
                            case 'range':
                                var value = _this.input.toNumber(changes[i][3]);
                                if (value === null) {
                                    changes[i][3] = changes[i][2]; // 入力も元に戻す
                                }
                                else {
                                    switch (value) {
                                        case 1:
                                            changes[i][3] = "引張鉄筋";
                                            break;
                                        case 2:
                                            changes[i][3] = "引張＋圧縮";
                                            break;
                                        case 3:
                                            changes[i][3] = "全周鉄筋";
                                            break;
                                        default:
                                            changes[i][3] = changes[i][2]; // 入力も元に戻す
                                    }
                                }
                                break;
                            default:
                            //何もしない
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        };
        this.concrete_strength_table_settings = {
            beforeChange: function (source, changes) { }
        };
    }
    /////////////////////////////////////////////////////////////////////////////////////
    // 保存データを処理する関数
    SafetyFactorsMaterialStrengthsComponent.prototype.ngOnInit = function () {
        // 仕様によるタイトルの初期化
        this.input.initSpecificationTitles();
        // グループリストを取得
        this.groupe_list = this.input.getGroupeList();
        // 配列を作成
        this.safety_factors_table_datas = new Array(); // 安全係数
        this.steel_strength_table_datas = new Array(); // 鉄筋材料
        this.concrete_strength_table_datas = new Array(); // コンクリート材料
        this.pile_factor_list = new Array(); // 杭の施工条件
        this.pile_factor_selected = new Array();
        // 入力項目を作成
        for (var i = 0; i < this.groupe_list.length; i++) {
            var g = this.groupe_list[i];
            var data = this.input.getTableColumns(g[0].g_no);
            // 安全係数
            var safety = data['safety_factor'];
            var title = data['safety_factor_title'];
            this.safety_factors_table_datas.push(this.set_safety_factors_table_datas(safety, title));
            // 鉄筋材料
            this.steel_strength_table_datas[i] = new Array();
            var steel = data['material_steel'];
            // セパレータ
            this.steel_strength_table_datas[i].push(this.set_steel_strength_table_split(steel[0]));
            var titles = ['', '軸方向鉄筋', '側方向鉄筋', 'スターラップ', '折曲げ鉄筋'];
            for (var j = 1; j < steel.length; j++) {
                this.steel_strength_table_datas[i].push(this.set_steel_strength_table_column(steel[j], titles[j]));
            }
            // コンクリート材料
            this.concrete_strength_table_datas[i] = new Array();
            var concrete = data['material_concrete'];
            this.concrete_strength_table_datas[i].push({
                title: 'コンクリートの設計基準強度 fck(N/mm2)',
                value: concrete.fck
            });
            this.concrete_strength_table_datas[i].push({
                title: '粗骨材の最大寸法 (mm)',
                value: concrete.dmax
            });
            // 杭の施工条件
            this.pile_factor_list = data['pile_factor_list'];
            this.pile_factor_selected[i] = data['pile_factor_selected'];
        }
    };
    // 安全係数のデータをテーブル用の変数に整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.set_safety_factors_table_datas = function (safety, title) {
        var result = safety;
        for (var i = 0; i < result.length; i++) {
            // タイトルを追加する
            result[i].title = title[i];
            // range　を文字列に変換
            switch (result[i].range) {
                case 1:
                    result[i].range = '引張鉄筋';
                    break;
                case 2:
                    result[i].range = '引張＋圧縮';
                    break;
                case 3:
                    result[i].range = '全周鉄筋';
                    break;
                default:
                    result[i].range = '';
            }
        }
        return result;
    };
    // 鉄筋のセパレータをテーブル用の変数に整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.set_steel_strength_table_split = function (split) {
        var result = {
            title: '',
            fsy1: 'D' + split['fsy1'] + '以下',
            fsu1: 'D' + split['fsu1'] + '以下'
        };
        var fsy2 = this.input.getNextRebar(split['fsy1']);
        if (fsy2 !== undefined) {
            result['fsy2'] = 'D' + fsy2.D + '以上';
        }
        else {
            result['fsy2'] = '';
        }
        var fsu2 = this.input.getNextRebar(split['fsu1']);
        if (fsu2 !== undefined) {
            result['fsu2'] = 'D' + fsu2.D + '以上';
        }
        else {
            result['fsu2'] = '';
        }
        return result;
    };
    // 鉄筋の軸方向鉄筋をテーブル用のデータに整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.set_steel_strength_table_column = function (steel, title) {
        var result = steel;
        result['title'] = title;
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    // 入力変更を処理する関数
    // tslint:disable-next-line: use-life-cycle-interface
    SafetyFactorsMaterialStrengthsComponent.prototype.ngOnDestroy = function () {
        var result = new Array();
        for (var i = 0; i < this.groupe_list.length; i++) {
            var g = this.groupe_list[i];
            result.push({
                'g_no': g[0].g_no,
                'safety_factor': this.get_safety_factors_table_datas(this.safety_factors_table_datas[i]),
                'material_steel': this.get_set_steel_strength_table_datas(this.steel_strength_table_datas[i]),
                'material_concrete': this.get_concrete_strength_table_datas(this.concrete_strength_table_datas[i]),
                'pile_factor_selected': this.pile_factor_selected[i]
            });
        }
        this.input.setTableColumns(result);
    };
    // 安全係数のデータを保存用に整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.get_safety_factors_table_datas = function (safety_factors_table_datas) {
        var result = safety_factors_table_datas;
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var safety = result_1[_i];
            if (safety.title) {
                delete safety.title;
            }
            switch (safety.range) {
                case '引張鉄筋':
                    safety.range = 1;
                    break;
                case '引張＋圧縮':
                    safety.range = 2;
                    break;
                case '全周鉄筋':
                    safety.range = 3;
                    break;
                default:
            }
        }
        return result;
    };
    // 鉄筋のセパレータを保存用に整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.get_set_steel_strength_table_datas = function (steel_strength_table_datas) {
        var result = steel_strength_table_datas;
        for (var _i = 0, _a = Object.keys(result[0]); _i < _a.length; _i++) {
            var key = _a[_i];
            result[0][key] = this.input.toNumber(result[0][key].toString().replace('D', '').replace('以下', ''));
        }
        for (var i = 1; i < result.length; i++) {
            for (var _b = 0, _c = Object.keys(result[i]); _b < _c.length; _b++) {
                var key = _c[_b];
                result[i][key] = this.input.toNumber(result[i][key]);
            }
        }
        return result;
    };
    // コンクリート材料データを保存用に整形する
    SafetyFactorsMaterialStrengthsComponent.prototype.get_concrete_strength_table_datas = function (concrete_strength_table_datas) {
        var result = concrete_strength_table_datas;
        for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
            var column = result_2[_i];
            for (var _a = 0, _b = Object.keys(column); _a < _b.length; _a++) {
                var key = _b[_a];
                column[key] = this.input.toNumber(column[key]);
            }
        }
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    // 杭の施工条件を変更を処理する関数
    SafetyFactorsMaterialStrengthsComponent.prototype.setPileFactor = function (i, j) {
        var id = this.pile_factor_list[j].id;
        this.pile_factor_selected[i] = id;
    };
    SafetyFactorsMaterialStrengthsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-safety-factors-material-strengths',
            templateUrl: './safety-factors-material-strengths.component.html',
            styleUrls: ['./safety-factors-material-strengths.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputSafetyFactorsMaterialStrengthsService])
    ], SafetyFactorsMaterialStrengthsComponent);
    return SafetyFactorsMaterialStrengthsComponent;
}());
export { SafetyFactorsMaterialStrengthsComponent };
//# sourceMappingURL=safety-factors-material-strengths.component.js.map