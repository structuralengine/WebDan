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

  safety_moment_pages: any[];

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

    // 安全性曲げモーメント
    this.safety_moment_pages = this.resultData.safety_moment_pages();

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
