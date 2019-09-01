import * as tslib_1 from "tslib";
import { SaveDataService } from '../providers/save-data.service';
import { Injectable } from '@angular/core';
var ResultDataService = /** @class */ (function () {
    function ResultDataService(save) {
        this.save = save;
    }
    // 断面力一覧を取得
    ResultDataService.prototype.getDesignForceList = function (calcTarget, pickupNoList) {
        var result;
        if (this.save.isManual() === true) {
            result = this.getDesignForceFromManualInput(calcTarget, pickupNoList);
        }
        else {
            result = this.getDesignForceFromPickUpData(calcTarget, pickupNoList);
        }
        return result;
    };
    // 断面力手入力情報から断面力一覧を取得
    ResultDataService.prototype.getDesignForceFromManualInput = function (calcTarget, pickupNoList) {
        // 断面力を取得
        var force = this.save.force.getDesignForce(calcTarget);
        // 部材グループ・照査する着目点を取得
        var result = this.getEnableMembers(calcTarget);
        return new Array();
    };
    // ピックアップデータから断面力一覧を取得
    ResultDataService.prototype.getDesignForceFromPickUpData = function (calcTarget, pickupNoList) {
        // 部材グループ・照査する着目点を取得
        var result = this.getEnableMembers(calcTarget);
        // 断面力を取得
        var force = this.save.pickup_data;
        for (var i = 0; i < pickupNoList.length; i++) {
            var pickupNo = 'pickUpNo:' + pickupNoList[i];
            if (pickupNo in force === false) {
                return new Array(); // ピックアップ番号の入力が不正
            }
            var targetForce = force[pickupNo];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var groupe = result_1[_i];
                var _loop_1 = function (member) {
                    var targetMember = targetForce.find(function (value) {
                        return (value.m_no === member.m_no);
                    });
                    if (targetMember === undefined) {
                        return { value: new Array() };
                    }
                    var _loop_2 = function (positions) {
                        var targetPosition = targetMember.positions.find(function (value) {
                            return (value.position === positions.position);
                        });
                        if (targetPosition === undefined) {
                            return { value: new Array() };
                        }
                        if ('designForce' in positions === false) {
                            positions['designForce'] = new Array();
                        }
                        var designForce = {
                            Mmax: targetPosition['M'].max,
                            Mmin: targetPosition['M'].min,
                            Smax: targetPosition['S'].max,
                            Smin: targetPosition['S'].min,
                            Nmax: targetPosition['N'].max,
                            Nmin: targetPosition['N'].min
                        };
                        positions['designForce'].push(designForce);
                    };
                    for (var _i = 0, _a = member.positions; _i < _a.length; _i++) {
                        var positions = _a[_i];
                        var state_2 = _loop_2(positions);
                        if (typeof state_2 === "object")
                            return state_2;
                    }
                };
                for (var _a = 0, groupe_1 = groupe; _a < groupe_1.length; _a++) {
                    var member = groupe_1[_a];
                    var state_1 = _loop_1(member);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
        }
        return result;
    };
    // 計算対象の着目点のみを抽出する
    ResultDataService.prototype.getEnableMembers = function (calcTarget) {
        var temp = this.save.points.getDesignPointColumns();
        var result = temp.slice(0, temp.length); // 複製
        // 計算対象ではない着目点を削除する
        var groupe_delete_flug = true;
        while (groupe_delete_flug) {
            groupe_delete_flug = false;
            for (var i = 0; i < result.length; i++) {
                var groupe = result[i];
                var member_delete_flug = true;
                while (member_delete_flug) {
                    member_delete_flug = false;
                    for (var j = 0; j < groupe.length; j++) {
                        var positions = groupe[j].positions;
                        var position_delete_flug = true;
                        while (position_delete_flug) {
                            position_delete_flug = false;
                            for (var k = 0; k < positions.length; k++) {
                                var enable = void 0;
                                switch (calcTarget) {
                                    case 'Moment':
                                        // 曲げモーメントの照査の場合
                                        enable = (positions[k].isMyCalc === true || positions[k].isMzCalc === true);
                                        break;
                                    case 'ShearForce':
                                        // せん断力の照査の場合
                                        enable = (positions[k].isVyCalc === true || positions[k].isVzCalc === true);
                                        break;
                                }
                                if (enable === false) {
                                    positions.splice(k, 1);
                                    position_delete_flug = true;
                                    break;
                                }
                            }
                            // 照査する着目点がなければ 対象部材を削除
                            if (positions.length === 0) {
                                groupe.splice(j, 1);
                                member_delete_flug = true;
                                break;
                            }
                        }
                    }
                }
                // 照査する部材がなければ 対象グループを削除
                if (groupe.length === 0) {
                    result.splice(i, 1);
                    groupe_delete_flug = true;
                    break;
                }
            }
        }
        return result;
    };
    ResultDataService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SaveDataService])
    ], ResultDataService);
    return ResultDataService;
}());
export { ResultDataService };
//# sourceMappingURL=result-data.service.js.map