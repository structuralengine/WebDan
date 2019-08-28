import { TestBed } from '@angular/core/testing';

import { CalcSafetyFatigueMomentService } from './calc-safety-fatigue-moment.service';

describe('CalcSafetyFatigueMomentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcSafetyFatigueMomentService = TestBed.get(CalcSafetyFatigueMomentService);
    expect(service).toBeTruthy();
  });
});
