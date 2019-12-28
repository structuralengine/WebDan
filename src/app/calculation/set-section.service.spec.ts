import { TestBed } from '@angular/core/testing';

import { SetSectionService } from './set-section.service';

describe('SetSectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetSectionService = TestBed.get(SetSectionService);
    expect(service).toBeTruthy();
  });
});
