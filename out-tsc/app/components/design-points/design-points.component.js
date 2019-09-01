import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputDesignPointsService } from '../../providers/input-design-points.service';
import { SaveDataService } from '../../providers/save-data.service';
var DesignPointsComponent = /** @class */ (function () {
    function DesignPointsComponent(input, save) {
        this.input = input;
        this.save = save;
        this.table_settings = {
            beforeChange: function (source, changes) {
            },
            afterChange: function (hotInstance, changes, source) {
            }
        };
    }
    DesignPointsComponent.prototype.ngOnInit = function () {
        this.isManual = this.save.isManual();
        var height = this.ht_container.nativeElement.offsetHeight;
        this.hottable_height = height - 180;
        this.groupe_list = this.input.getDesignPointColumns();
        this.table_datas = new Array(this.groupe_list.length);
        for (var i = 0; i < this.groupe_list.length; i++) {
            this.table_datas[i] = new Array();
            for (var j = 0; j < this.groupe_list[i].length; j++) {
                var member = this.groupe_list[i][j];
                for (var k = 0; k < member['positions'].length; k++) {
                    var column = member['positions'][k];
                    if (k === 0) {
                        // 最初の行には 部材番号を表示する
                        column['m_no'] = member['m_no'];
                    }
                    this.table_datas[i].push(column);
                }
            }
        }
    };
    tslib_1.__decorate([
        ViewChild('ht_container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], DesignPointsComponent.prototype, "ht_container", void 0);
    DesignPointsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-design-points',
            templateUrl: './design-points.component.html',
            styleUrls: ['./design-points.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [InputDesignPointsService,
            SaveDataService])
    ], DesignPointsComponent);
    return DesignPointsComponent;
}());
export { DesignPointsComponent };
//# sourceMappingURL=design-points.component.js.map