import { TestBed, inject } from '@angular/core/testing';

import { InputSectionForcesService } from './input-section-forces.service';

describe('InputSectionForcesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputSectionForcesService]
    });
  });

  it('should be created', inject([InputSectionForcesService], (service: InputSectionForcesService) => {
    expect(service).toBeTruthy();
  }));
});
