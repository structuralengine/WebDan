import { TestBed } from '@angular/core/testing';

import { CalcSafetyFatigueShearForceService } from './calc-safety-fatigue-shear-force.service';

describe('CalcSafetyFatigueShearForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcSafetyFatigueShearForceService = TestBed.get(CalcSafetyFatigueShearForceService);
    expect(service).toBeTruthy();
  });
});
