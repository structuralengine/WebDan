import { TestBed } from '@angular/core/testing';

import { InputSteelsService } from './input-steels.service';

describe('SteelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputSteelsService = TestBed.get(InputSteelsService);
    expect(service).toBeTruthy();
  });
});
