import { TestBed, inject } from '@angular/core/testing';
import { InputBasicInformationService } from './input-basic-information.service';
describe('InputBasicInformationService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputBasicInformationService]
        });
    });
    it('should be created', inject([InputBasicInformationService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-basic-information.service.spec.js.map