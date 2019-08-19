import { TestBed, inject } from '@angular/core/testing';

import { InputFatiguesService } from './input-fatigues.service';

describe('InputFatiguesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputFatiguesService]
    });
  });

  it('should be created', inject([InputFatiguesService], (service: InputFatiguesService) => {
    expect(service).toBeTruthy();
  }));
});
