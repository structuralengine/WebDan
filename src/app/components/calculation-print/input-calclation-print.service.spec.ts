import { TestBed, inject } from '@angular/core/testing';

import { InputCalclationPrintService } from './input-calclation-print.service';

describe('InputCalclationPrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputCalclationPrintService]
    });
  });

  it('should be created', inject([InputCalclationPrintService], (service: InputCalclationPrintService) => {
    expect(service).toBeTruthy();
  }));
});
