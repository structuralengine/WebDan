import { TestBed } from '@angular/core/testing';

import { CalcRestorabilityShearForceService } from './calc-restorability-shear-force.service';

describe('CalcRestorabilityShearForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcRestorabilityShearForceService = TestBed.get(CalcRestorabilityShearForceService);
    expect(service).toBeTruthy();
  });
});
