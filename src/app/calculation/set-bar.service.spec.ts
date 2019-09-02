import { TestBed } from '@angular/core/testing';

import { SetBarService } from './set-bar.service';

describe('SetBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetBarService = TestBed.get(SetBarService);
    expect(service).toBeTruthy();
  });
});
