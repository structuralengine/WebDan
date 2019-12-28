import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSafetyFatigueMomentComponent } from './result-safety-fatigue-moment.component';

describe('ResultSafetyFatigueMomentComponent', () => {
  let component: ResultSafetyFatigueMomentComponent;
  let fixture: ComponentFixture<ResultSafetyFatigueMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSafetyFatigueMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSafetyFatigueMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
