import { TestBed } from '@angular/core/testing';

import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';

describe('CalcServiceabilityMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcServiceabilityMomentService = TestBed.get(CalcServiceabilityMomentService);
    expect(service).toBeTruthy();
  });
});
