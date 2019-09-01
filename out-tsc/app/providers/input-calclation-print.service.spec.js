import { TestBed, inject } from '@angular/core/testing';
import { InputCalclationPrintService } from './input-calclation-print.service';
describe('InputCalclationPrintService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputCalclationPrintService]
        });
    });
    it('should be created', inject([InputCalclationPrintService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-calclation-print.service.spec.js.map