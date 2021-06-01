import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UserInfoService } from '../../providers/user-info.service';
import { InputCalclationPrintService } from '../../components/calculation-print/calculation-print.service';
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

  @ViewChild('print_section', { static: true }) print_section: ElementRef;

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
      // if (this.user.loggedIn === true) {
        this.printcalculate = true;
      // } else {
      //   alert('ログインしてください');
      //   return;
      // }
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

  public print() {
    printJS({
      printable: 'print_section',
      type: 'html',
      style: this.PrintCss
    });
  }

  private initPrintCss(): void {
    this.PrintCss =  '@page {';
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

    this.PrintCss += '.sheet-title{';
    this.PrintCss += '  font-size: 14px;'; 
    this.PrintCss += '  text-align: left;';
    this.PrintCss += '}';
    this.PrintCss += '  .sheet-title.indent10{text-indent: 1.0em;}';
    this.PrintCss += '  .sheet-title.indent20{text-indent: 2.0em;}';
    this.PrintCss += '  .sheet-title.indent30{text-indent: 3.0em;}';
    this.PrintCss += '  .sheet-title.indent40{text-indent: 4.0em;}';
    this.PrintCss += '  .sheet-title.indent50{text-indent: 5.0em;}';
    this.PrintCss += '  .sheet-title.indent60{text-indent: 6.0em;}';
    this.PrintCss += '  .sheet-title.indent65{text-indent: 6.5em;}';
    this.PrintCss += '  .sheet-title.indent70{text-indent: 7.0em;}';
    this.PrintCss += '  .sheet-title.indent75{text-indent: 7.5em;}';
    this.PrintCss += '  .sheet-title.indent80{text-indent: 8.0em;}';
    this.PrintCss += '  .sheet-title.indent90{text-indent: 9.0em;}';
    this.PrintCss += '  .sheet-title.indent95{text-indent: 9.5em;}';
    this.PrintCss += '  .sheet-title.indent100{text-indent: 10.0em;}';
    this.PrintCss += '  .sheet-title.indent105{text-indent: 10.5em;}';
    this.PrintCss += '  .sheet-title.indent110{text-indent: 11.0em;}';
    this.PrintCss += '  .sheet-title.indent120{text-indent: 12.0em;}';

    this.PrintCss += 'p.noword{margin-bottom: 14pt;}';
    this.PrintCss += 'p.caption{text-align: center;}'

    this.PrintCss += 'table.title{'
    this.PrintCss += 'text-align:center;'
    this.PrintCss += 'border: 1px solid black;'
    this.PrintCss += 'font-size: 12px;'
    this.PrintCss += 'width: 454px;'
    this.PrintCss += 'table-layout: fixed;'
    this.PrintCss += '}'
    this.PrintCss += 'table.formula{'
    this.PrintCss += 'text-align:center;'
    this.PrintCss += 'font-size: 12px;'
    this.PrintCss += 'margin: 0;'
    this.PrintCss += '}'
    this.PrintCss += '  td.bottom{'
    this.PrintCss += '    border-bottom: 1px solid black;'
    this.PrintCss += '  }'

    this.PrintCss += '.cell_title1{';
    this.PrintCss += '  font-size: 10pt; text-align: left;';
    this.PrintCss += '}';
    this.PrintCss += '.cell_title2{';
    this.PrintCss += '  font-size: 10pt; text-align: right;';
    this.PrintCss += '}';

    this.PrintCss += 'table.main {';
    this.PrintCss += '  font-size: 9px;';
    this.PrintCss += '  table-layout: fixed;';
    this.PrintCss += '  margin: 0;'
    this.PrintCss += '}';
    this.PrintCss += 'tr {';
    this.PrintCss += '  height: 9px;';
    this.PrintCss += '}';
    this.PrintCss += 'th{';
    this.PrintCss += '  text-align: center;';
    this.PrintCss += '  white-space: nowrap;';
    this.PrintCss += '}';
    this.PrintCss += 'td {';
    this.PrintCss += '  width: 91px;';
    this.PrintCss += '  height: 9px;';
    this.PrintCss += '}';
    this.PrintCss += '.left{ ';
    this.PrintCss += '  text-align: left;';
    this.PrintCss += '  padding-left: 10px;';
    this.PrintCss += '}';
    this.PrintCss += '.center{ ';
    this.PrintCss += '  text-align: center;';
    this.PrintCss += '}';
    this.PrintCss += '.right{ ';
    this.PrintCss += '  text-align: right;';
    this.PrintCss += '  padding-right: 10px;';
    this.PrintCss += '}';
    this.PrintCss += '.cell_name1{';
    this.PrintCss += '  width: 113px;';
    this.PrintCss += '}';
    this.PrintCss += '.cell_name2{';
    this.PrintCss += '  width: 53px;';
    this.PrintCss += '}';
    this.PrintCss += '.cell_name3{';
    this.PrintCss += '  width: 60px;';
    this.PrintCss += '}';
    this.PrintCss += '.g-top1{';
    this.PrintCss += '  border-top: 1px solid lightgray;';
    this.PrintCss += '}';
    this.PrintCss += '.g-right1{';
    this.PrintCss += '  border-right: 1px solid lightgray;';
    this.PrintCss += '}';
    this.PrintCss += '.g-bottom1{';
    this.PrintCss += '  border-bottom: 1px solid lightgray;';
    this.PrintCss += '}';
    this.PrintCss += '.g-left1{';
    this.PrintCss += '  border-left: 1px solid lightgray;';
    this.PrintCss += '}';

    this.PrintCss += '.g-top2{';
    this.PrintCss += '  border-top: 1px solid black;';
    this.PrintCss += '}';
    this.PrintCss += '.g-right2{';
    this.PrintCss += '  border-right: 1px solid black;';
    this.PrintCss += '}'
    this.PrintCss += '.g-bottom2{';
    this.PrintCss += '  border-bottom: 0.5px solid black;';
    this.PrintCss += '}';
    this.PrintCss += '.g-left2{';
    this.PrintCss += '  border-left: 1px solid black;';
    this.PrintCss += '}';
  }
}
