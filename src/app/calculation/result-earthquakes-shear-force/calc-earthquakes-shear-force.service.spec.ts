import { TestBed } from '@angular/core/testing';

import { CalcEarthquakesShearForceService } from './calc-earthquakes-shear-force.service';

describe('CalcEarthquakesShearForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcEarthquakesShearForceService = TestBed.get(CalcEarthquakesShearForceService);
    expect(service).toBeTruthy();
  });
});
