import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSummaryTableComponent } from './result-summary-table.component';

describe('ResultSummaryTableComponent', () => {
  let component: ResultSummaryTableComponent;
  let fixture: ComponentFixture<ResultSummaryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSummaryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
