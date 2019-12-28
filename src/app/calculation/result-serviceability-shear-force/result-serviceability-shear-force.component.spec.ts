import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultServiceabilityShearForceComponent } from './result-serviceability-shear-force.component';

describe('ResultServiceabilityShearForceComponent', () => {
  let component: ResultServiceabilityShearForceComponent;
  let fixture: ComponentFixture<ResultServiceabilityShearForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultServiceabilityShearForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultServiceabilityShearForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
