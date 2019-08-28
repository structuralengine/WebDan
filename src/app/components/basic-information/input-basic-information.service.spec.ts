import { TestBed, inject } from '@angular/core/testing';

import { InputBasicInformationService } from './input-basic-information.service';

describe('InputBasicInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputBasicInformationService]
    });
  });

  it('should be created', inject([InputBasicInformationService], (service: InputBasicInformationService) => {
    expect(service).toBeTruthy();
  }));
});
