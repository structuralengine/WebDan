import { TestBed } from '@angular/core/testing';

import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';

describe('CalcRestorabilityMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcRestorabilityMomentService = TestBed.get(CalcRestorabilityMomentService);
    expect(service).toBeTruthy();
  });
});
