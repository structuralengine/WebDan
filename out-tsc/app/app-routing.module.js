import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './components/blank-page/blank-page.component';
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { MembersComponent } from './components/members/members.component';
import { DesignPointsComponent } from './components/design-points/design-points.component';
import { BarsComponent } from './components/bars/bars.component';
import { FatiguesComponent } from './components/fatigues/fatigues.component';
import { SafetyFactorsMaterialStrengthsComponent } from './components/safety-factors-material-strengths/safety-factors-material-strengths.component';
import { SectionForcesComponent } from './components/section-forces/section-forces.component';
import { CalculationPrintComponent } from './components/calculation-print/calculation-print.component';
import { ResultViewerComponent } from './calculation/result-viewer/result-viewer.component';
var routes = [
    { path: '', redirectTo: '/basic-information', pathMatch: 'full' },
    { path: 'basic-information', component: BasicInformationComponent },
    { path: 'members', component: MembersComponent },
    { path: 'design-points', component: DesignPointsComponent },
    { path: 'bars', component: BarsComponent },
    { path: 'fatigues', component: FatiguesComponent },
    { path: 'safety-factors-material-strengths', component: SafetyFactorsMaterialStrengthsComponent },
    { path: 'section-forces', component: SectionForcesComponent },
    { path: 'calculation-print', component: CalculationPrintComponent },
    { path: 'result-viewer', component: ResultViewerComponent },
    { path: 'blank-page', component: BlankPageComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes, { useHash: true })],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map