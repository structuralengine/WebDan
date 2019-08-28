import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultServiceabilityMomentComponent } from './result-serviceability-moment.component';

describe('ResultServiceabilityMomentComponent', () => {
  let component: ResultServiceabilityMomentComponent;
  let fixture: ComponentFixture<ResultServiceabilityMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultServiceabilityMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultServiceabilityMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
