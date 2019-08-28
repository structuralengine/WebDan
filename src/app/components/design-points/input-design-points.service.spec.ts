import { TestBed, inject } from '@angular/core/testing';

import { InputDesignPointsService } from './input-design-points.service';

describe('InputDesignPointsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputDesignPointsService]
    });
  });

  it('should be created', inject([InputDesignPointsService], (service: InputDesignPointsService) => {
    expect(service).toBeTruthy();
  }));
});
