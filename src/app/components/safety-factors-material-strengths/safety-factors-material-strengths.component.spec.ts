import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyFactorsMaterialStrengthsComponent } from './safety-factors-material-strengths.component';

describe('SafetyFactorsMaterialStrengthsComponent', () => {
  let component: SafetyFactorsMaterialStrengthsComponent;
  let fixture: ComponentFixture<SafetyFactorsMaterialStrengthsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyFactorsMaterialStrengthsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyFactorsMaterialStrengthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
