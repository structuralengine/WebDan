import { async, TestBed } from '@angular/core/testing';
import { SafetyFactorsMaterialStrengthsComponent } from './safety-factors-material-strengths.component';
describe('SafetyFactorsMaterialStrengthsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [SafetyFactorsMaterialStrengthsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(SafetyFactorsMaterialStrengthsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=safety-factors-material-strengths.component.spec.js.map