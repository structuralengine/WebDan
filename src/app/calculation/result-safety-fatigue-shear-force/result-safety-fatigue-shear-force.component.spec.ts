import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSafetyFatigueShearForceComponent } from './result-safety-fatigue-shear-force.component';

describe('ResultSafetyFatigueShearForceComponent', () => {
  let component: ResultSafetyFatigueShearForceComponent;
  let fixture: ComponentFixture<ResultSafetyFatigueShearForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSafetyFatigueShearForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSafetyFatigueShearForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
