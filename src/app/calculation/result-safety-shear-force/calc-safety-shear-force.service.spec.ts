import { TestBed } from '@angular/core/testing';

import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';

describe('CalcSafetyShearForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcSafetyShearForceService = TestBed.get(CalcSafetyShearForceService);
    expect(service).toBeTruthy();
  });
});
