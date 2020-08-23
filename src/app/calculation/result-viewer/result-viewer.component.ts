import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UserInfoService } from '../../providers/user-info.service';
import { InputCalclationPrintService } from '../../components/calculation-print/input-calclation-print.service';
import { CalcDurabilityMomentService } from '../result-durability-moment/calc-durability-moment.service';
import { CalcEarthquakesMomentService } from '../result-earthquakes-moment/calc-earthquakes-moment.service';
import { CalcEarthquakesShearForceService } from '../result-earthquakes-shear-force/calc-earthquakes-shear-force.service';
import { CalcRestorabilityMomentService } from '../result-restorability-moment/calc-restorability-moment.service';
import { CalcRestorabilityShearForceService } from '../result-restorability-shear-force/calc-restorability-shear-force.service';
import { CalcSafetyFatigueMomentService } from '../result-safety-fatigue-moment/calc-safety-fatigue-moment.service';
import { CalcSafetyFatigueShearForceService } from '../result-safety-fatigue-shear-force/calc-safety-fatigue-shear-force.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';
import { CalcServiceabilityShearForceService } from '../result-serviceability-shear-force/calc-serviceability-shear-force.service';

import * as printJS from 'print-js';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.scss']
})
export class ResultViewerComponent implements OnInit {

  @ViewChild('print_section') print_section: ElementRef;

  // 目次 /////////////////////////////////
  public printcalculate: boolean;
  public printSectionForce: boolean;

  // 印刷時のスタイル /////////////////////////////////
  private PrintCss: string;

  constructor(private user: UserInfoService,
              private printControl: InputCalclationPrintService,
              public durabilityMoment: CalcDurabilityMomentService,
              public earthquakesMoment: CalcEarthquakesMomentService,
              public earthquakesShearForce: CalcEarthquakesShearForceService,
              public restorabilityMoment: CalcRestorabilityMomentService,
              public restorabilityShearForce: CalcRestorabilityShearForceService,
              public SafetyFatigueMoment: CalcSafetyFatigueMomentService,
              public safetyFatigueShearForce: CalcSafetyFatigueShearForceService,
              public safetyMoment: CalcSafetyMomentService,
              public safetyShearForce: CalcSafetyShearForceService,
              public serviceabilityMoment: CalcServiceabilityMomentService,
              public serviceabilityShearForce: CalcServiceabilityShearForceService
  ) { }

  ngOnInit() {

    this.initPrintCss();

    this.printSectionForce = this.printControl.print_selected.print_section_force_checked;

    this.printcalculate = false;
    if (this.printControl.print_selected.print_calculate_checked === true) {
      /*
      if (this.user.loggedIn === true) {
      */
        this.printcalculate = true;
      /*
      } else {
        alert('ログインしてください');
        return;
      }
      */
    }

    this.durabilityMoment.setDesignForces();
    this.earthquakesMoment.setDesignForces();
    this.earthquakesShearForce.setDesignForces();
    this.restorabilityMoment.setDesignForces();
    this.restorabilityShearForce.setDesignForces();
    this.SafetyFatigueMoment.setDesignForces();
    this.safetyFatigueShearForce.setDesignForces();
    this.safetyMoment.setDesignForces();
    this.safetyShearForce.setDesignForces();
    this.serviceabilityMoment.setDesignForces();
    this.serviceabilityShearForce.setDesignForces();

  }

  public printTest() {
    printJS({
      printable: 'print_section',
      type: 'html',
      style: this.PrintCss
    });
  }

  private initPrintCss(): void {
    this.PrintCss = '@page {';
    this.PrintCss += 'size: A4;';
    this.PrintCss += 'margin: 0;';
    this.PrintCss += '}';

    this.PrintCss += 'h3 {';
    this.PrintCss += '  font-size: 11pt;';
    this.PrintCss += ' }';

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
    this.PrintCss += 'padding-top: 30mm;';
    this.PrintCss += 'padding-left: 30mm;';
    this.PrintCss += 'padding-right: 30mm;';
    this.PrintCss += '}';
  }
}
