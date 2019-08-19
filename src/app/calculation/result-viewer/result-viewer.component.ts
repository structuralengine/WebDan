import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons, NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';

import * as printJS from "print-js";
//import printJS = require("print-js");

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


  private htmlString: SafeHtml;
  mathJaxObject;

  constructor(private sanitizer: DomSanitizer,
    private resultData: ResultDataService,
    public cs: ConfigService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const modalRef = this.modalService.open(WaitDialogComponent);

    // 安全性曲げモーメント
     this.safety_moment_pages = this.resultData.safety_moment_pages();




     modalRef.close();

/*

    this.htmlString = this.sanitizer.bypassSecurityTrustHtml(this.resultData.htmlContents);
    this.loadMathConfig();
    this.renderMath();

    modalRef.close();
    */
  }
/*
  updateMathObt() {
    this.mathJaxObject = this.cs.nativeGlobal()['MathJax'];
  }

  renderMath() {
    this.updateMathObt();
    const angObj = this;
    setTimeout(() => {
      angObj.mathJaxObject['Hub'].Queue(['Typeset', angObj.mathJaxObject.Hub], 'mathContent');
    }, 1000);
  }

  loadMathConfig() {
    this.updateMathObt();
    this.mathJaxObject.Hub.Config({
      showMathMenu: false,
      tex2jax: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']] },
      menuSettings: { zoom: 'Double-Click', zscale: '150%' },
      CommonHTML: { linebreaks: { automatic: true } },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } }
    });
  }
*/
  printTest() {
    printJS('print-section', 'html');
  }
}