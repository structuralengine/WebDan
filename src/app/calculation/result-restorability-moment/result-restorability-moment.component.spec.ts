import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRestorabilityMomentComponent } from './result-restorability-moment.component';

describe('ResultRestorabilityMomentComponent', () => {
  let component: ResultRestorabilityMomentComponent;
  let fixture: ComponentFixture<ResultRestorabilityMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultRestorabilityMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultRestorabilityMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
