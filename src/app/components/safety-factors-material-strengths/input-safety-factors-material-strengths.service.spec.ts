import { TestBed, inject } from '@angular/core/testing';

import { InputSafetyFactorsMaterialStrengthsService } from './input-safety-factors-material-strengths.service';

describe('InputSafetyFactorsMaterialStrengthsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputSafetyFactorsMaterialStrengthsService]
    });
  });

  it('should be created', inject([InputSafetyFactorsMaterialStrengthsService], (service: InputSafetyFactorsMaterialStrengthsService) => {
    expect(service).toBeTruthy();
  }));
});
