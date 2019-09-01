import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputMembersService } from './input-members.service';
var InputDesignPointsService = /** @class */ (function (_super) {
    tslib_1.__extends(InputDesignPointsService, _super);
    function InputDesignPointsService(members) {
        var _this = _super.call(this) || this;
        _this.members = members;
        _this.clear();
        return _this;
    }
    InputDesignPointsService.prototype.clear = function () {
        // 部材, 着目点 入力画面に関する初期化
        this.position_list = new Array();
        // デフォルトで、数行のデータを用意しておく
        for (var i = 1; i <= this.DEFAULT_MEMBER_COUNT; i++) {
            var new_point = this.default_positions(i, [this.default_position('', null)]);
            new_point.positions[0].isMyCalc = true;
            new_point.positions[0].isVyCalc = true;
            this.position_list.push(new_point);
        }
    };
    // 着目点情報
    InputDesignPointsService.prototype.default_positions = function (id, position) {
        return {
            'm_no': id, 'positions': position
        };
    };
    InputDesignPointsService.prototype.default_position = function (p_name, position) {
        return {
            'p_name': p_name, 'position': position, 'p_name_ex': null,
            'isMyCalc': null, 'isVyCalc': null,
            'isMzCalc': null, 'isVzCalc': null,
            'La': null
        };
    };
    /// <summary>
    /// pick up ファイルをセットする関数
    /// </summary>
    /// <param name="row">行番号</param>
    InputDesignPointsService.prototype.setPickUpData = function (pickup_data) {
        var mList = pickup_data[Object.keys(pickup_data)[0]];
        // 着目点リストを作成する
        var old_position_list = this.position_list.slice(0, this.position_list.length);
        this.position_list = new Array();
        var _loop_1 = function (i) {
            // 部材番号 をセットする
            var new_member = old_position_list.find(function (value) {
                return value.m_no === mList[i].memberNo;
            });
            if (new_member === undefined) {
                new_member = this_1.default_positions(mList[i].memberNo, new Array);
            }
            // positions を代入
            new_member['positions'] = new Array();
            var _loop_2 = function (j) {
                var new_position = old_position_list.find(function (value) {
                    for (var k = 0; k < value.positions.Length; k++) {
                        return value.positions[k].position === mList[i].positions[j].position;
                    }
                });
                if (new_position === undefined) {
                    new_position = this_1.default_position(mList[i].positions[j].p_name, mList[i].positions[j].position);
                }
                new_member['positions'].push(new_position);
            };
            for (var j = 0; j < mList[i].positions.length; j++) {
                _loop_2(j);
            }
            this_1.position_list.push(new_member);
        };
        var this_1 = this;
        for (var i = 0; i < mList.length; i++) {
            _loop_1(i);
        }
    };
    /// <summary>
    /// design-point の
    /// g_no でグループ化した配列のデータを返す関数
    /// </summary>
    InputDesignPointsService.prototype.getDesignPointColumns = function () {
        var result = new Array();
        // グループ番号を持つ部材のリストを返す
        for (var _i = 0, _a = this.members.getGroupeList(); _i < _a.length; _i++) {
            var members = _a[_i];
            var positions = new Array();
            var _loop_3 = function (m) {
                var p = this_2.position_list.find(function (value) {
                    return value.m_no === m.m_no;
                });
                if (p === undefined) {
                    return "continue";
                }
                p['g_no'] = m.g_no;
                p['g_name'] = m.g_name;
                p['B'] = m.B;
                p['H'] = m.H;
                positions.push(p);
            };
            var this_2 = this;
            for (var _b = 0, members_1 = members; _b < members_1.length; _b++) {
                var m = members_1[_b];
                _loop_3(m);
            }
            result.push(positions);
        }
        return result;
    };
    InputDesignPointsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [InputMembersService])
    ], InputDesignPointsService);
    return InputDesignPointsService;
}(InputDataService));
export { InputDesignPointsService };
//# sourceMappingURL=input-design-points.service.js.map