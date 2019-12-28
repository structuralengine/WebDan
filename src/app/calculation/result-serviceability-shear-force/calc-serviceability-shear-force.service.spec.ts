import { TestBed } from '@angular/core/testing';

import { CalcServiceabilityShearForceService } from './calc-serviceability-shear-force.service';

describe('CalcServiceabilityShearForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcServiceabilityShearForceService = TestBed.get(CalcServiceabilityShearForceService);
    expect(service).toBeTruthy();
  });
});
