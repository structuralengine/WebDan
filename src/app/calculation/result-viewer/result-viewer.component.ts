import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.scss']
})

export class ResultViewerComponent implements OnInit {

  // 安全性（破壊）
  safetyMomentPages: any[];
  safetyShearForcePages: any[];
  // 安全性（疲労破壊）
  safetyFatigueMomentPages: any[];
  safetyFatigueShearForcepages: any[];
  // 耐久性
  serviceabilityMomentPages: any[];
  serviceabilityShearForcePages: any[];
  // 使用性
  durabilityMomentPages: any[];
  // 復旧性（地震時以外）
  restorabilityMomentPages: any[];
  restorabilityShearForcePages: any[];
  // 復旧性（地震時）
  earthquakesMomentPages: any[];
  earthquakesShearForcePages: any[];

  // 印刷時のスタイル
  private PrintCss: string;

  constructor( private modalService: NgbModal,
               private CalcSafetyMoment: CalcSafetyMomentService,
               private CalcSafetyShearForce: CalcSafetyShearForceService,
               private CalcSafetyFatigueMoment: CalcSafetyFatigueMomentService,
               private CalcSafetyFatigueShearForce: CalcSafetyFatigueShearForceService,
               private CalcServiceabilityMoment: CalcServiceabilityMomentService,
               private CalcServiceabilityShearForce: CalcServiceabilityShearForceService,
               private CalcDurabilityMoment: CalcDurabilityMomentService,
               private CalcRestorabilityMoment: CalcRestorabilityMomentService,
               private CalcRestorabilityShearForce: CalcRestorabilityShearForceService,
               private CalcEarthquakesMoment: CalcEarthquakesMomentService,
               private CalcEarthquakesShearForce: CalcEarthquakesShearForceService ) {

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

  ngOnInit() {
    const modalRef = this.modalService.open(WaitDialogComponent);

    // 安全性（破壊）
    this.safetyMomentPages = this.CalcSafetyMoment.safety_moment_pages();
    this.safetyShearForcePages = this.CalcSafetyShearForce.safety_shear_force_pages();
    // 安全性（疲労破壊）
    this.safetyFatigueMomentPages = this.CalcSafetyFatigueMoment.safety_fatigue_moment_pages();
    this.safetyFatigueShearForcepages = this.CalcSafetyFatigueShearForce.safety_fatigue_shear_force_pages();
    // 耐久性
    this.serviceabilityMomentPages = this.CalcServiceabilityMoment.serviceability_moment_pages();
    this.serviceabilityShearForcePages = this.CalcServiceabilityShearForce.serviceability_shear_force_pages();
    // 使用性
    this.durabilityMomentPages = this.CalcDurabilityMoment.durability_moment_pages();
    // 復旧性（地震時以外）
    this.restorabilityMomentPages = this.CalcRestorabilityMoment.restorability_moment_pages();
    this.restorabilityShearForcePages = this.CalcRestorabilityShearForce.restorability_shear_force_pages();
    // 復旧性（地震時）
    this.earthquakesMomentPages = this.CalcEarthquakesMoment.earthquakes_moment_pages();
    this.earthquakesShearForcePages = this.CalcEarthquakesShearForce.earthquakes_shear_force_pages();

    modalRef.close();

  }

  printTest() {
    printJS({
      printable: 'print-section',
      type: 'html',
      style: this.PrintCss
    });
  }

}
