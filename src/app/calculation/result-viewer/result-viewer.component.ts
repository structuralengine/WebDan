import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as printJS from 'print-js';
// import printJS = require("print-js");

import { WaitDialogComponent } from '../../components/wait-dialog/wait-dialog.component';

import { ResultDataService } from '../result-data.service';
import { ConfigService } from '../../providers/config.service';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.scss']
})

export class ResultViewerComponent implements OnInit {

  // 安全性（破壊）
  safety_moment_pages: any[];
  safety_shear_force_pages: any[];
  // 安全性（疲労破壊）
  safety_fatigue_moment_pages: any[];
  safety_fatigue_shear_force_pages: any[];
  // 耐久性
  serviceability_moment_pages: any[];
  serviceability_shear_force_pages: any[];
  // 使用性
  durability_moment_pages: any[];
  // 復旧性（地震時以外）
  restorability_moment_pages: any[];
  restorability_shear_force_pages: any[];
  // 復旧性（地震時）
  earthquakes_moment_pages: any[];
  earthquakes_shear_force_pages: any[];

  // 印刷時のスタイル
  private print_css: string;

  constructor(private resultData: ResultDataService,
    private modalService: NgbModal
  ) {

    this.print_css = '@page {';
    this.print_css += 'size: A4;';
    this.print_css += 'margin: 0;';
    this.print_css += '}';

    this.print_css += '* {';
    this.print_css += 'font-family:"ＭＳ 明朝", "HG明朝E", "游明朝", YuMincho, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "ＭＳ Ｐ明朝", serif;';
    this.print_css += 'margin: 0;';
    this.print_css += 'padding: 0;';
    this.print_css += '}';

    this.print_css += '.sheet {';
    this.print_css += 'overflow: hidden;';
    this.print_css += 'position: relative;';
    this.print_css += 'box-sizing: border-box;';
    this.print_css += 'page-break-after: always;';
    this.print_css += 'padding-top: 35mm;';
    this.print_css += 'padding-left: 30mm;';
    this.print_css += 'padding-right: 30mm;';
    this.print_css += '}';
  }

  ngOnInit() {
    const modalRef = this.modalService.open(WaitDialogComponent);

    // 安全性（破壊）
    this.safety_moment_pages = this.resultData.safety_moment_pages();
    this.safety_shear_force_pages = this.resultData.safety_shear_force_pages();
    // 安全性（疲労破壊）
    this.safety_fatigue_moment_pages = this.resultData.safety_fatigue_moment_pages();
    this.safety_fatigue_shear_force_pages = this.resultData.safety_fatigue_shear_force_pages();
    // 耐久性
    this.serviceability_shear_force_pages = this.resultData.serviceability_shear_force_pages();
    // 使用性
    this.durability_moment_pages = this.resultData.durability_moment_pages();
    // 復旧性（地震時以外）
    this.restorability_moment_pages = this.resultData.restorability_moment_pages();
    this.restorability_shear_force_pages = this.resultData.restorability_shear_force_pages();
    // 復旧性（地震時）
    this.earthquakes_moment_pages = this.resultData.earthquakes_moment_pages();
    this.earthquakes_shear_force_pages = this.resultData.earthquakes_shear_force_pages();

    modalRef.close();

  }

  printTest() {
    printJS({
      printable: 'print-section',
      type: 'html',
      style: this.print_css
    });
  }

}
