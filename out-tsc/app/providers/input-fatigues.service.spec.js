import { TestBed, inject } from '@angular/core/testing';
import { InputFatiguesService } from './input-fatigues.service';
describe('InputFatiguesService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputFatiguesService]
        });
    });
    it('should be created', inject([InputFatiguesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-fatigues.service.spec.js.map