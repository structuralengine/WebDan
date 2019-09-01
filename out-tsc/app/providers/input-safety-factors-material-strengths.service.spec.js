import { TestBed, inject } from '@angular/core/testing';
import { InputSafetyFactorsMaterialStrengthsService } from './input-safety-factors-material-strengths.service';
describe('InputSafetyFactorsMaterialStrengthsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputSafetyFactorsMaterialStrengthsService]
        });
    });
    it('should be created', inject([InputSafetyFactorsMaterialStrengthsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-safety-factors-material-strengths.service.spec.js.map