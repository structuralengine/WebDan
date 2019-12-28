import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEarthquakesShearForceComponent } from './result-earthquakes-shear-force.component';

describe('ResultEarthquakesShearForceComponent', () => {
  let component: ResultEarthquakesShearForceComponent;
  let fixture: ComponentFixture<ResultEarthquakesShearForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultEarthquakesShearForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEarthquakesShearForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
