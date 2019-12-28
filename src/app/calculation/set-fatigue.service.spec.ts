import { TestBed } from '@angular/core/testing';

import { SetFatigueService } from './set-fatigue.service';

describe('SetFatigueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetFatigueService = TestBed.get(SetFatigueService);
    expect(service).toBeTruthy();
  });
});
