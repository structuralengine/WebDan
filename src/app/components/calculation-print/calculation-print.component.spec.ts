import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationPrintComponent } from './calculation-print.component';

describe('CalculationPrintComponent', () => {
  let component: CalculationPrintComponent;
  let fixture: ComponentFixture<CalculationPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculationPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
