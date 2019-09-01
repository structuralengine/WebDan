import { TestBed, inject } from '@angular/core/testing';
import { InputDataService } from './input-data.service';
describe('InputDataService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputDataService]
        });
    });
    it('should be created', inject([InputDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-data.service.spec.js.map