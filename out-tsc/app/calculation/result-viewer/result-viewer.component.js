import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as printJS from 'print-js';
// import printJS = require("print-js");
import { WaitDialogComponent } from '../../components/wait-dialog/wait-dialog.component';
import { CalcSafetyMomentService } from '../calc-safety-moment.service';
import { CalcSafetyShearForceService } from '../calc-safety-shear-force.service';
import { CalcSafetyFatigueMomentService } from '../calc-safety-fatigue-moment.service';
import { CalcSafetyFatigueShearForceService } from '../calc-safety-fatigue-shear-force.service';
import { CalcServiceabilityMomentService } from '../calc-serviceability-moment.service';
import { CalcServiceabilityShearForceService } from '../calc-serviceability-shear-force.service';
import { CalcDurabilityMomentService } from '../calc-durability-moment.service';
import { CalcRestorabilityMomentService } from '../calc-restorability-moment.service';
import { CalcRestorabilityShearForceService } from '../calc-restorability-shear-force.service';
import { CalcEarthquakesMomentService } from '../calc-earthquakes-moment.service';
import { CalcEarthquakesShearForceService } from '../calc-earthquakes-shear-force.service';
var ResultViewerComponent = /** @class */ (function () {
    function ResultViewerComponent(modalService, CalcSafetyMoment, CalcSafetyShearForce, CalcSafetyFatigueMoment, CalcSafetyFatigueShearForce, CalcServiceabilityMoment, CalcServiceabilityShearForce, CalcDurabilityMoment, CalcRestorabilityMoment, CalcRestorabilityShearForce, CalcEarthquakesMoment, CalcEarthquakesShearForce) {
        this.modalService = modalService;
        this.CalcSafetyMoment = CalcSafetyMoment;
        this.CalcSafetyShearForce = CalcSafetyShearForce;
        this.CalcSafetyFatigueMoment = CalcSafetyFatigueMoment;
        this.CalcSafetyFatigueShearForce = CalcSafetyFatigueShearForce;
        this.CalcServiceabilityMoment = CalcServiceabilityMoment;
        this.CalcServiceabilityShearForce = CalcServiceabilityShearForce;
        this.CalcDurabilityMoment = CalcDurabilityMoment;
        this.CalcRestorabilityMoment = CalcRestorabilityMoment;
        this.CalcRestorabilityShearForce = CalcRestorabilityShearForce;
        this.CalcEarthquakesMoment = CalcEarthquakesMoment;
        this.CalcEarthquakesShearForce = CalcEarthquakesShearForce;
        this.PrintCss = '@page {';
        this.PrintCss += 'size: A4;';
        this.PrintCss += 'margin: 0;';
        this.PrintCss += '}';
        this.PrintCss += '* {';
        this.PrintCss += 'font-family:"ＭＳ 明朝", "HG明朝E", "游明朝", YuMincho, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "ＭＳ Ｐ明朝", serif;';
        this.PrintCss += 'margin: 0;';
        this.PrintCss += 'padding: 0;';
        this.PrintCss += '}';
        this.PrintCss += '.sheet {';
        this.PrintCss += 'overflow: hidden;';
        this.PrintCss += 'position: relative;';
        this.PrintCss += 'box-sizing: border-box;';
        this.PrintCss += 'page-break-after: always;';
        this.PrintCss += 'padding-top: 35mm;';
        this.PrintCss += 'padding-left: 30mm;';
        this.PrintCss += 'padding-right: 30mm;';
        this.PrintCss += '}';
    }
    ResultViewerComponent.prototype.ngOnInit = function () {
        var modalRef = this.modalService.open(WaitDialogComponent);
        // 断面力一覧表 /////////////////////////////////////
        // 安全性（破壊）
        this.safetyMomentForces = this.CalcSafetyMoment.setDesignForces();
        this.safetyShearForces = this.CalcSafetyShearForce.setDesignForces();
        // 安全性（疲労破壊）
        this.safetyFatigueMomentForces = this.CalcSafetyFatigueMoment.setDesignForces();
        this.safetyFatigueShearForces = this.CalcSafetyFatigueShearForce.setDesignForces();
        // 耐久性
        this.serviceabilityMomentForces = this.CalcServiceabilityMoment.setDesignForces();
        this.serviceabilityShearForces = this.CalcServiceabilityShearForce.setDesignForces();
        // 使用性
        this.durabilityMomentForces = this.CalcDurabilityMoment.setDesignForces();
        // 復旧性（地震時以外）
        this.restorabilityMomentForces = this.CalcRestorabilityMoment.setDesignForces();
        this.restorabilityShearForces = this.CalcRestorabilityShearForce.setDesignForces();
        // 復旧性（地震時）
        this.earthquakesMomentForces = this.CalcEarthquakesMoment.setDesignForces();
        this.earthquakesShearForces = this.CalcEarthquakesShearForce.setDesignForces();
        // 断面照査表 /////////////////////////////////////
        // 安全性（破壊）
        this.safetyMomentPages = this.CalcSafetyMoment.getSafetyPages();
        this.safetyShearForcePages = this.CalcSafetyShearForce.getSafetyPages();
        // 安全性（疲労破壊）
        this.safetyFatigueMomentPages = this.CalcSafetyFatigueMoment.getSafetyFatiguePages();
        this.safetyFatigueShearForcepages = this.CalcSafetyFatigueShearForce.getSafetyFatiguePages();
        // 耐久性
        this.serviceabilityMomentPages = this.CalcServiceabilityMoment.getServiceabilityPages();
        this.serviceabilityShearForcePages = this.CalcServiceabilityShearForce.getServiceabilityPages();
        // 使用性
        this.durabilityMomentPages = this.CalcDurabilityMoment.getDurabilityPages();
        // 復旧性（地震時以外）
        this.restorabilityMomentPages = this.CalcRestorabilityMoment.getRestorabilityPages();
        this.restorabilityShearForcePages = this.CalcRestorabilityShearForce.getRestorabilityPages();
        // 復旧性（地震時）
        this.earthquakesMomentPages = this.CalcEarthquakesMoment.getEarthquakesPages();
        this.earthquakesShearForcePages = this.CalcEarthquakesShearForce.getEarthquakesPages();
        modalRef.close();
    };
    ResultViewerComponent.prototype.printTest = function () {
        printJS({
            printable: 'print-section',
            type: 'html',
            style: this.PrintCss
        });
    };
    ResultViewerComponent = tslib_1.__decorate([
        Component({
            selector: 'app-result-viewer',
            templateUrl: './result-viewer.component.html',
            styleUrls: ['./result-viewer.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [NgbModal,
            CalcSafetyMomentService,
            CalcSafetyShearForceService,
            CalcSafetyFatigueMomentService,
            CalcSafetyFatigueShearForceService,
            CalcServiceabilityMomentService,
            CalcServiceabilityShearForceService,
            CalcDurabilityMomentService,
            CalcRestorabilityMomentService,
            CalcRestorabilityShearForceService,
            CalcEarthquakesMomentService,
            CalcEarthquakesShearForceService])
    ], ResultViewerComponent);
    return ResultViewerComponent;
}());
export { ResultViewerComponent };
//# sourceMappingURL=result-viewer.component.js.map