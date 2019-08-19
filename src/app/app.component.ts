import { Component, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { InputDataService } from './providers/input-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  baseUrl: string;
  project: string;


  isCalculated: boolean;
  isManual: boolean;

  constructor(platformLocation: PlatformLocation,
              private _router: Router,
              private input: InputDataService) {

    const location = (platformLocation as any).location;
    this.baseUrl = location.origin + location.pathname;
    console.log('baseUrl', this.baseUrl);

    // custom property
    this.isCalculated = false;
    this.isManual = true;

  }

  ngOnInit() {
  }

  dialogClose(): void {
    this.deactiveButtons();
  }

  activePageChenge(id): void {
    this.deactiveButtons();
    document.getElementById(id).classList.add('active');
  }

  // アクティブになっているボタンを全て非アクティブにする
  deactiveButtons() {
    for (let i = 0; i <= 11; i++) {
      let data = document.getElementById(i + '');
      if (data != null) {
        if (data.classList.contains('active')) {
          data.classList.remove('active');
        }
      }
    }
  }


}
