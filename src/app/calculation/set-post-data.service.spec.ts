import { TestBed } from '@angular/core/testing';

import { SetPostDataService } from './set-post-data.service';

describe('SetPostDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetPostDataService = TestBed.get(SetPostDataService);
    expect(service).toBeTruthy();
  });
});
