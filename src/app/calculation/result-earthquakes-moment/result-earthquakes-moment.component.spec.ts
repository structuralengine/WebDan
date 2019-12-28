import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEarthquakesMomentComponent } from './result-earthquakes-moment.component';

describe('ResultEarthquakesMomentComponent', () => {
  let component: ResultEarthquakesMomentComponent;
  let fixture: ComponentFixture<ResultEarthquakesMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultEarthquakesMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEarthquakesMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
