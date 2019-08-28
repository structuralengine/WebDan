import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRestorabilityShearForceComponent } from './result-restorability-shear-force.component';

describe('ResultRestorabilityShearForceComponent', () => {
  let component: ResultRestorabilityShearForceComponent;
  let fixture: ComponentFixture<ResultRestorabilityShearForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultRestorabilityShearForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultRestorabilityShearForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
