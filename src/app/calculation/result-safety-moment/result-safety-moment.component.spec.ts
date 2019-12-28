import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSafetyMomentComponent } from './result-safety-moment.component';

describe('ResultSafetyMomentComponent', () => {
  let component: ResultSafetyMomentComponent;
  let fixture: ComponentFixture<ResultSafetyMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSafetyMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSafetyMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
