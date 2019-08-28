import { TestBed, inject } from '@angular/core/testing';

import { InputBarsService } from './input-bars.service';

describe('InputBarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputBarsService]
    });
  });

  it('should be created', inject([InputBarsService], (service: InputBarsService) => {
    expect(service).toBeTruthy();
  }));
});
