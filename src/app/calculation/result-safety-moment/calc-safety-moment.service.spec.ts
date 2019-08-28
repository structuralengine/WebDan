import { TestBed } from '@angular/core/testing';

import { CalcSafetyMomentService } from './calc-safety-moment.service';

describe('CalcSafetyMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcSafetyMomentService = TestBed.get(CalcSafetyMomentService);
    expect(service).toBeTruthy();
  });
});
