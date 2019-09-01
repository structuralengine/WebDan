import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputBarsService } from '../../providers/input-bars.service';
var BarsComponent = /** @class */ (function () {
    function BarsComponent(input) {
        this.input = input;
        this.table_settings = {
            beforeChange: function (source, changes) {
            },
            afterChange: function (hotInstance, changes, source) {
            }
        };
    }
    BarsComponent.prototype.ngOnInit = function () {
        var height = this.ht_container.nativeElement.offsetHeight;
        this.hottable_height = height - 250;
        this.groupe_list = this.input.getBarsColumns();
        this.table_datas = new Array(this.groupe_list.length);
        for (var i = 0; i < this.groupe_list.length; i++) {
            this.table_datas[i] = new Array();
            for (var j = 0; j < this.groupe_list[i].length; j++) {
                var member = this.groupe_list[i][j];
                for (var k = 0; k < member['positions'].length; k++) {
                    var data = member['positions'][k];
                    var column1 = {};
                    var column2 = {};
                    if (k === 0) {
                        // 最初の行には 部材番号を表示する
                        column1['m_no'] = data['m_no'];
                    }
                    // 1行目
                    column1['p_name'] = data['p_name'];
                    column1['p_name_ex'] = data['p_name_ex'];
                    column1['bh'] = data['b'];
                    column1['haunch_height'] = data['haunch_M'];
                    column1['design_point_id'] = data['rebar1'].title;
                    column1['rebar_dia'] = data['rebar1'].rebar_dia;
                    column1['rebar_n'] = data['rebar1'].rebar_n;
                    column1['rebar_cover'] = data['rebar1'].rebar_cover;
                    column1['rebar_lines'] = data['rebar1'].rebar_lines;
                    column1['rebar_space'] = data['rebar1'].rebar_space;
                    column1['rebar_ss'] = data['rebar1'].rebar_ss;
                    column1['cos'] = data['rebar1'].cos;
                    column1['enable'] = data['rebar1'].enable;
                    column1['side_dia'] = data['sidebar'].side_dia;
                    column1['side_n'] = data['sidebar'].side_n;
                    column1['side_cover'] = data['sidebar'].side_cover;
                    column1['side_ss'] = data['sidebar'].side_ss;
                    column1['stirrup_dia'] = data['starrup'].stirrup_dia;
                    column1['stirrup_n'] = data['starrup'].stirrup_n;
                    column1['stirrup_ss'] = data['starrup'].stirrup_ss;
                    column1['bending_dia'] = data['bend'].bending_dia;
                    column1['bending_n'] = data['bend'].bending_n;
                    column1['bending_ss'] = data['bend'].bending_ss;
                    column1['bending_angle'] = data['bend'].bending_angle;
                    column1['tan'] = data['tan'];
                    this.table_datas[i].push(column1);
                    // 2行目
                    column2['bh'] = data['h'];
                    column2['haunch_height'] = data['haunch_V'];
                    column2['design_point_id'] = data['rebar2'].title;
                    column2['rebar_dia'] = data['rebar2'].rebar_dia;
                    column2['rebar_n'] = data['rebar2'].rebar_n;
                    column2['rebar_cover'] = data['rebar2'].rebar_cover;
                    column2['rebar_lines'] = data['rebar2'].rebar_lines;
                    column2['rebar_space'] = data['rebar2'].rebar_space;
                    column2['rebar_ss'] = data['rebar2'].rebar_ss;
                    column2['cos'] = data['rebar2'].cos;
                    column2['enable'] = data['rebar2'].enable;
                    this.table_datas[i].push(column2);
                }
            }
        }
    };
    // tslint:disable-next-line: use-life-cycle-interface
    BarsComponent.prototype.ngOnDestroy = function () {
        this.input.setBarsColumns(this.table_datas);
    };
    tslib_1.__decorate([
        ViewChild('ht_container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], BarsComponent.prototype, "ht_container", void 0);
    BarsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-bars',
            templateUrl: './bars.component.html',
            styleUrls: ['./bars.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputBarsService])
    ], BarsComponent);
    return BarsComponent;
}());
export { BarsComponent };
//# sourceMappingURL=bars.component.js.map