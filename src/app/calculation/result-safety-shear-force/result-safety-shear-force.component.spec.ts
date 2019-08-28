import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSafetyShearForceComponent } from './result-safety-shear-force.component';

describe('ResultSafetyShearForceComponent', () => {
  let component: ResultSafetyShearForceComponent;
  let fixture: ComponentFixture<ResultSafetyShearForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSafetyShearForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSafetyShearForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
