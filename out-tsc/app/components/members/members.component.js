import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputMembersService } from '../../providers/input-members.service';
var MembersComponent = /** @class */ (function () {
    function MembersComponent(input) {
        var _this = this;
        this.input = input;
        this.mambers_table_settings = {
            beforeChange: function (source, changes) {
                try {
                    for (var i = 0; i < changes.length; i++) {
                        switch (changes[i][1]) {
                            case 'vis_u':
                            case 'vis_l':
                                // 外観ひび割れの入力が変更された場合、何もしない
                                break;
                            case 'g_name':
                                // 他の共通断面
                                if (changes[i][3] === null) {
                                    continue;
                                } // 初期値は対象にしない
                                for (var j = 0; j < _this.mambers_table_datarows.length; j++) {
                                    var row = changes[i][0];
                                    if (row === j) {
                                        continue;
                                    } // 同じ行は比較しない
                                    var targetColumn = _this.input.member_list[j];
                                    if (targetColumn['g_no'] === null) {
                                        continue;
                                    } // 初期値は対象にしない
                                    var changesColumn = _this.input.member_list[row];
                                    if (targetColumn['g_no'] === changesColumn['g_no']) {
                                        targetColumn['g_name'] = changes[i][3];
                                    }
                                }
                                break;
                            case 'g_no':
                                // 他の共通断面
                                if (changes[i][3] === null) {
                                    continue;
                                } // 初期値は対象にしない
                                for (var j = 0; j < _this.mambers_table_datarows.length; j++) {
                                    var row = changes[i][0];
                                    if (row === j) {
                                        continue;
                                    } // 同じ行は比較しない
                                    var targetColumn = _this.input.member_list[j];
                                    if (targetColumn['g_no'] === null) {
                                        continue;
                                    } // 初期値は対象にしない
                                    if (targetColumn['g_no'] === changes[i][3]) {
                                        _this.input.member_list[row]['g_name'] = targetColumn['g_name'];
                                    }
                                }
                                break;
                            case 'shape':
                                // 番号を断面形状名に変換
                                switch (changes[i][3].trim()) {
                                    case '1':
                                    case 'RC-矩形':
                                        changes[i][3] = 'RC-矩形';
                                        break;
                                    case '2':
                                    case 'RC-T形':
                                        changes[i][3] = 'RC-T形';
                                        break;
                                    case '3':
                                    case 'RC-円形':
                                        changes[i][3] = 'RC-円形';
                                        break;
                                    case '4':
                                    case 'RC-小判':
                                        changes[i][3] = 'RC-小判';
                                        break;
                                    case '11':
                                    case 'SRC-矩形':
                                        changes[i][3] = 'SRC-矩形';
                                        break;
                                    case '12':
                                    case 'SRC-T形':
                                        changes[i][3] = 'SRC-T形';
                                        break;
                                    case '13':
                                    case 'SRC-円形':
                                        changes[i][3] = 'SRC-円形';
                                        break;
                                    default:
                                        changes[i][3] = '';
                                }
                                break;
                            case 'con_u':
                            case 'con_l':
                            case 'con_s':
                                switch (changes[i][3]) {
                                    case 1:
                                    case 2:
                                    case 3:
                                        break;
                                    default:
                                        changes[i][3] = '';
                                }
                                break;
                            case 'B':
                            case 'H':
                            case 'Bt':
                            case 't':
                            case 'ecsd':
                            case 'kr':
                            case 'r1_1':
                            case 'r1_2':
                            case 'r1_3':
                            case 'n':
                                // 数字チェック
                                var value = _this.input.toNumber(changes[i][3]);
                                if (value === null) {
                                    changes[i][3] = null;
                                }
                                break;
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            },
            afterChange: function (hotInstance, changes, source) {
            },
        };
    }
    MembersComponent.prototype.ngOnInit = function () {
        var ht_container_height = this.ht_container.nativeElement.offsetHeight;
        var header_height = this.header.nativeElement.offsetHeight;
        this.hottable_height = ht_container_height - header_height;
        // テーブルの初期化
        this.mambers_table_datarows = new Array();
        for (var i = 0; i < this.input.member_list.length; i++) {
            var row = this.input.member_list[i];
            var column = this.input.getMemberTableColumns(row.m_no);
            this.mambers_table_datarows.push(column);
        }
    };
    tslib_1.__decorate([
        ViewChild('ht_container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], MembersComponent.prototype, "ht_container", void 0);
    tslib_1.__decorate([
        ViewChild('header'),
        tslib_1.__metadata("design:type", ElementRef)
    ], MembersComponent.prototype, "header", void 0);
    MembersComponent = tslib_1.__decorate([
        Component({
            selector: 'app-members',
            templateUrl: './members.component.html',
            styleUrls: ['./members.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputMembersService])
    ], MembersComponent);
    return MembersComponent;
}());
export { MembersComponent };
//# sourceMappingURL=members.component.js.map