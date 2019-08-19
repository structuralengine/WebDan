import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';


import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HotTableModule } from '@handsontable/angular';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InputDataService } from './providers/input-data.service';
import { InputBasicInformationService } from './providers/input-basic-information.service';
import { InputMembersService } from './providers/input-members.service';
import { InputDesignPointsService } from './providers/input-design-points.service';
import { InputBarsService } from './providers/input-bars.service';
import { InputFatiguesService } from './providers/input-fatigues.service';
import { InputSafetyFactorsMaterialStrengthsService } from './providers/input-safety-factors-material-strengths.service';
import { InputSectionForcesService } from './providers/input-section-forces.service';
import { InputCalclationPrintService } from './providers/input-calclation-print.service';
import { SaveDataService } from './providers/save-data.service';

import { ResultDataService } from './calculation/result-data.service';
import { UserInfoService } from './providers/user-info.service';

import { MenuComponent } from './components/menu/menu.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { WaitDialogComponent } from './components/wait-dialog/wait-dialog.component';


import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { MembersComponent } from './components/members/members.component';
import { DesignPointsComponent } from './components/design-points/design-points.component';
import { BarsComponent } from './components/bars/bars.component';
import { FatiguesComponent } from './components/fatigues/fatigues.component';
import { SafetyFactorsMaterialStrengthsComponent } from './components/safety-factors-material-strengths/safety-factors-material-strengths.component';
import { SectionForcesComponent } from './components/section-forces/section-forces.component';
import { CalculationPrintComponent } from './components/calculation-print/calculation-print.component';
import { ResultViewerComponent } from './calculation/result-viewer/result-viewer.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    HotTableModule
  ],
  declarations: [
    AppComponent,
    WebviewDirective,
    MenuComponent,
    LoginDialogComponent,
    WaitDialogComponent,
    ResultViewerComponent,
    BasicInformationComponent,
    MembersComponent,
    DesignPointsComponent,
    BarsComponent,
    FatiguesComponent,
    SafetyFactorsMaterialStrengthsComponent,
    SectionForcesComponent,
    CalculationPrintComponent
  ],
  entryComponents: [
    LoginDialogComponent,
    WaitDialogComponent,
    ResultViewerComponent
  ],
  providers: [
    SaveDataService,
    InputDataService,
    InputBasicInformationService,
    InputMembersService,
    InputDesignPointsService,
    InputBarsService,
    InputFatiguesService,
    InputSafetyFactorsMaterialStrengthsService,
    InputSectionForcesService,
    InputCalclationPrintService,
    ResultDataService,
    UserInfoService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
