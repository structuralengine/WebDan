import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDurabilityMomentComponent } from './result-durability-moment.component';

describe('ResultDurabilityMomentComponent', () => {
  let component: ResultDurabilityMomentComponent;
  let fixture: ComponentFixture<ResultDurabilityMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultDurabilityMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDurabilityMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
