import { TestBed, inject } from '@angular/core/testing';
import { ResultDataService } from './result-data.service';
describe('ResultDataService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ResultDataService]
        });
    });
    it('should be created', inject([ResultDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=result-data.service.spec.js.map