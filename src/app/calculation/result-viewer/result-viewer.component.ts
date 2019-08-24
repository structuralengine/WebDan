import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import * as printJS from "print-js";
// import printJS = require("print-js");

import { SaveDataService } from "../../providers/save-data.service";
import { WaitDialogComponent } from "../../components/wait-dialog/wait-dialog.component";

import { CalcSafetyMomentService } from "../calc-safety-moment.service";
import { CalcSafetyShearForceService } from "../calc-safety-shear-force.service";
import { CalcSafetyFatigueMomentService } from "../calc-safety-fatigue-moment.service";
import { CalcSafetyFatigueShearForceService } from "../calc-safety-fatigue-shear-force.service";
import { CalcServiceabilityMomentService } from "../calc-serviceability-moment.service";
import { CalcServiceabilityShearForceService } from "../calc-serviceability-shear-force.service";
import { CalcDurabilityMomentService } from "../calc-durability-moment.service";
import { CalcRestorabilityMomentService } from "../calc-restorability-moment.service";
import { CalcRestorabilityShearForceService } from "../calc-restorability-shear-force.service";
import { CalcEarthquakesMomentService } from "../calc-earthquakes-moment.service";
import { CalcEarthquakesShearForceService } from "../calc-earthquakes-shear-force.service";

@Component({
  selector: "app-result-viewer",
  templateUrl: "./result-viewer.component.html",
  styleUrls: ["./result-viewer.component.scss"]
})
export class ResultViewerComponent implements OnInit {
  // 断面力一覧表 /////////////////////////////////////
  // 安全性（破壊）
  private safetyMomentForces: any[];
  private safetyShearForces: any[];
  // 安全性（疲労破壊）
  private safetyFatigueMomentForces: any[];
  private safetyFatigueShearForces: any[];
  // 耐久性
  private serviceabilityMomentForces: any[];
  private serviceabilityShearForces: any[];
  // 使用性
  private durabilityMomentForces: any[];
  // 復旧性（地震時以外）
  private restorabilityMomentForces: any[];
  private restorabilityShearForces: any[];
  // 復旧性（地震時）
  private earthquakesMomentForces: any[];
  private earthquakesShearForces: any[];

  // 断面照査表 /////////////////////////////////////
  // 安全性（破壊）
  private safetyMomentPages: any[];
  private safetyShearForcePages: any[];
  // 安全性（疲労破壊）
  private safetyFatigueMomentPages: any[];
  private safetyFatigueShearForcepages: any[];
  // 耐久性
  private serviceabilityMomentPages: any[];
  private serviceabilityShearForcePages: any[];
  // 使用性
  private durabilityMomentPages: any[];
  // 復旧性（地震時以外）
  private restorabilityMomentPages: any[];
  private restorabilityShearForcePages: any[];
  // 復旧性（地震時）
  private earthquakesMomentPages: any[];
  private earthquakesShearForcePages: any[];

  // 印刷時のスタイル /////////////////////////////////
  private PrintCss: string;

  constructor(
    private save: SaveDataService,
    private modalService: NgbModal,
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
    private CalcEarthquakesShearForce: CalcEarthquakesShearForceService
  ) {
    this.PrintCss = "@page {";
    this.PrintCss += "size: A4;";
    this.PrintCss += "margin: 0;";
    this.PrintCss += "}";

    this.PrintCss += "* {";
    this.PrintCss +=
      'font-family:"ＭＳ 明朝", "HG明朝E", "游明朝", YuMincho, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "ＭＳ Ｐ明朝", serif;';
    this.PrintCss += "margin: 0;";
    this.PrintCss += "padding: 0;";
    this.PrintCss += "}";
/*
    this.PrintCss += ".h3 {";
    this.PrintCss += "  font-size: 11pt;";
    this.PrintCss += "}";
*/  
    this.PrintCss += ".sheet {";
    this.PrintCss += "overflow: hidden;";
    this.PrintCss += "position: relative;";
    this.PrintCss += "box-sizing: border-box;";
    this.PrintCss += "page-break-after: always;";
    this.PrintCss += "padding-top: 35mm;";
    this.PrintCss += "padding-left: 30mm;";
    this.PrintCss += "padding-right: 30mm;";
    this.PrintCss += "}";
  }

  ngOnInit() {
    const modalRef = this.modalService.open(WaitDialogComponent);

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
    if (this.save.calc.print_selected.print_calculate_checked === true) {
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
    } else {
      this.safetyMomentPages = new Array();
      this.safetyShearForcePages = new Array();
      this.safetyFatigueMomentPages = new Array();
      this.safetyFatigueShearForcepages = new Array();
      this.serviceabilityMomentPages = new Array();
      this.serviceabilityShearForcePages = new Array();
      this.durabilityMomentPages = new Array();
      this.restorabilityMomentPages = new Array();
      this.restorabilityShearForcePages = new Array();
      this.earthquakesMomentPages = new Array();
      this.earthquakesShearForcePages = new Array();

      if (this.save.calc.print_selected.print_summary_table_checked === true) {
        // 総括表のみ
        window.alert("総括表まだ");
      }
    }
    modalRef.close();
  }

  printTest() {
    printJS({
      printable: "print-section",
      type: "html",
      style: this.PrintCss
    });
  }
}
