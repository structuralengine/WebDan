import { TestBed } from '@angular/core/testing';

import { CalcEarthquakesMomentService } from './calc-earthquakes-moment.service';

describe('CalcEarthquakesMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcEarthquakesMomentService = TestBed.get(CalcEarthquakesMomentService);
    expect(service).toBeTruthy();
  });
});
