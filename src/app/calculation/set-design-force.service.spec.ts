import { TestBed } from '@angular/core/testing';

import { SetDesignForceService } from './set-design-force.service';

describe('SetDesignForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetDesignForceService = TestBed.get(SetDesignForceService);
    expect(service).toBeTruthy();
  });
});
