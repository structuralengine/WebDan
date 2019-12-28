import { TestBed } from '@angular/core/testing';

import { CalcDurabilityMomentService } from './calc-durability-moment.service';

describe('CalcDurabilityMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcDurabilityMomentService = TestBed.get(CalcDurabilityMomentService);
    expect(service).toBeTruthy();
  });
});
