import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
var InputMembersService = /** @class */ (function (_super) {
    tslib_1.__extends(InputMembersService, _super);
    function InputMembersService() {
        var _this = _super.call(this) || this;
        _this.clear();
        return _this;
    }
    InputMembersService.prototype.clear = function () {
        this.member_list = new Array();
        // デフォルトで、数行のデータを用意しておく
        for (var i = 1; i <= this.DEFAULT_MEMBER_COUNT; i++) {
            var new_member = this.default_member(i);
            new_member.g_no = 1;
            this.member_list.push(new_member);
        }
    };
    // 部材情報
    InputMembersService.prototype.default_member = function (id) {
        return {
            'm_no': id, 'm_len': null, 'g_no': null, 'g_name': null, 'shape': '',
            'B': null, 'H': null, 'Bt': null, 't': null,
            'con_u': null, 'con_l': null, 'con_s': null,
            'vis_u': false, 'vis_l': false, 'ecsd': null, 'kr': null,
            'r1_1': null, 'r1_2': null, 'r1_3': null, 'n': null
        };
    };
    /// <summary>
    /// pick up ファイルをセットする関数
    /// </summary>
    /// <param name="row">行番号</param>
    InputMembersService.prototype.setPickUpData = function (pickup_data) {
        var mList = pickup_data[Object.keys(pickup_data)[0]];
        // 部材リストを作成する
        var old_member_list = this.member_list.slice(0, this.member_list.length);
        this.member_list = new Array();
        var _loop_1 = function (i) {
            var new_member = old_member_list.find(function (value) {
                return value.m_no === mList[i].memberNo;
            });
            if (new_member === undefined) {
                new_member = this_1.default_member(mList[i].memberNo);
            }
            // 部材長をセットする
            var pList = mList[i].positions;
            new_member.m_len = pList[pList.length - 1].position;
            new_member.g_no = null;
            this_1.member_list.push(new_member);
        };
        var this_1 = this;
        // 部材番号、部材長 をセットする
        for (var i = 0; i < mList.length; i++) {
            _loop_1(i);
        }
    };
    /// <summary>
    /// basic-information.component の
    /// pickup_moment_datarows のデータを返す関数
    /// </summary>
    /// <param name="row">行番号</param>
    InputMembersService.prototype.getMemberTableColumns = function (row) {
        var r = this.member_list.filter(function (item, index) {
            if (item.m_no === row) {
                return item;
            }
        });
        if (r === undefined) {
            return null;
        }
        var result = r[0];
        // 対象データが無かった時に処理
        if (result == null) {
            result = this.default_member(row);
            this.member_list.push(result);
        }
        return result;
    };
    // 存在するグループ番号を列挙する
    InputMembersService.prototype.getGroupeList = function () {
        var groupe_no_list = new Array();
        var _loop_2 = function (m) {
            if (this_2.toNumber(m['g_no']) === null) {
                m['g_no'] = null;
                return "continue";
            }
            var g = m['g_no'];
            if (groupe_no_list.find(function (value) {
                return value === g;
            }) === undefined) {
                groupe_no_list.push(g);
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.member_list; _i < _a.length; _i++) {
            var m = _a[_i];
            _loop_2(m);
        }
        groupe_no_list.sort(function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
        // グループ番号を持つ部材のリストを返す
        var result = new Array();
        var _loop_3 = function (no) {
            // グループ番号を持つ部材のリスト
            var members = this_3.member_list.filter(function (item, index) {
                if (item.g_no === no) {
                    return item;
                }
            });
            result.push(members);
        };
        var this_3 = this;
        for (var _b = 0, groupe_no_list_1 = groupe_no_list; _b < groupe_no_list_1.length; _b++) {
            var no = groupe_no_list_1[_b];
            _loop_3(no);
        }
        return result;
    };
    InputMembersService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], InputMembersService);
    return InputMembersService;
}(InputDataService));
export { InputMembersService };
//# sourceMappingURL=input-members.service.js.map