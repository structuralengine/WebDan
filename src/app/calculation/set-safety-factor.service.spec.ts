import { TestBed } from '@angular/core/testing';

import { SetSafetyFactorService } from './set-safety-factor.service';

describe('SetSafetyFactorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetSafetyFactorService = TestBed.get(SetSafetyFactorService);
    expect(service).toBeTruthy();
  });
});
