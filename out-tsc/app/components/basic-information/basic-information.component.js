import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { InputBasicInformationService } from '../../providers/input-basic-information.service';
import { SaveDataService } from '../../providers/save-data.service';
var BasicInformationComponent = /** @class */ (function () {
    function BasicInformationComponent(input, save) {
        var _this = this;
        this.input = input;
        this.save = save;
        // pickup_table に関する変数
        this.pickup_moment_title = 'ピックアップ (曲げ耐力用)';
        this.pickup_shear_force_title = 'ピックアップ (せん断耐力用)';
        this.pickup_title_column_header = '断面照査に用いる応力';
        this.pickup_table_settings = {
            beforeChange: function (source, changes) {
                try {
                    for (var i = 0; i < changes.length; i++) {
                        var value = _this.input.toNumber(changes[i][3]);
                        if (value === null) {
                            changes[i][3] = null;
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            },
            afterChange: function (hotInstance, changes, source) {
            }
        };
    }
    BasicInformationComponent.prototype.ngOnInit = function () {
        // 適用 に関する変数 の初期化
        this.specification1_selected = this.input.specification1_selected;
        this.specification1_list = this.input.specification1_list;
        // 仕様 に関する変数 の初期化
        this.specification2_selected = this.input.specification2_selected;
        this.specification2_list = this.input.specification2_list;
        //  設計条件 に関する初期化
        this.conditions_list = this.input.conditions_list;
        // pickup_table に関する初期化
        this.initPickupTable();
        this.isManual = this.save.isManual();
    };
    // tslint:disable-next-line: use-life-cycle-interface
    BasicInformationComponent.prototype.ngOnDestroy = function () {
        for (var row = 0; row < this.pickup_moment_datarows.length; row++) {
            var column = this.pickup_moment_datarows[row];
            this.input.setPickUpNoMomentColumns(row, column['pickup_no']);
        }
        for (var row = 0; row < this.pickup_shear_force_datarows.length; row++) {
            var column = this.pickup_shear_force_datarows[row];
            this.input.setPickUpNoShearForceColumns(row, column['pickup_no']);
        }
    };
    /// <summary>
    /// pick up table の初期化関数
    /// </summary>
    /// <param name="i">選択された番号</param>
    BasicInformationComponent.prototype.initPickupTable = function () {
        this.pickup_moment_datarows = new Array();
        this.pickup_shear_force_datarows = new Array();
        for (var row = 0; row < this.input.pickup_moment_count(); row++) {
            var column = this.input.getPickUpNoMomentColumns(row);
            this.pickup_moment_datarows.push(column);
        }
        for (var row = 0; row < this.input.pickup_shear_force_count(); row++) {
            var column = this.input.getPickUpNoShearForceColumns(row);
            this.pickup_shear_force_datarows.push(column);
        }
    };
    /// <summary>
    /// 適用 変更時の処理
    /// </summary>
    /// <param name="i">選択された番号</param>
    BasicInformationComponent.prototype.setSpecification1 = function (i) {
        this.input.specification1_selected = i;
        this.input.initSpecificationTitles();
        // 適用 に関する変数 の初期化
        this.specification1_selected = i;
        this.specification1_list = this.input.specification1_list;
        // 仕様 に関する変数 の初期化
        this.setSpecification2(this.input.specification2_selected);
        this.specification2_list = this.input.specification2_list;
        //  設計条件 に関する初期化
        this.conditions_list = this.input.conditions_list;
        // pickup_table に関する初期化
        this.initPickupTable();
    };
    /// <summary>
    /// 仕様 変更時の処理
    /// </summary>
    /// <param name="i">選択された番号</param>
    BasicInformationComponent.prototype.setSpecification2 = function (i) {
        this.input.specification2_selected = i;
    };
    /// <summary>
    /// 設計条件 変更時の処理
    /// </summary>
    /// <param name="item">変更されたアイテム</param>
    /// <param name="isChecked">チェックボックスの状態</param>
    BasicInformationComponent.prototype.conditionsCheckChanged = function (id, isChecked) {
        this.input.setConditions(id, isChecked);
        this.conditions_list = this.input.conditions_list;
    };
    BasicInformationComponent = tslib_1.__decorate([
        Component({
            selector: 'app-basic-information',
            templateUrl: './basic-information.component.html',
            styleUrls: ['./basic-information.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputBasicInformationService,
            SaveDataService])
    ], BasicInformationComponent);
    return BasicInformationComponent;
}());
export { BasicInformationComponent };
//# sourceMappingURL=basic-information.component.js.map