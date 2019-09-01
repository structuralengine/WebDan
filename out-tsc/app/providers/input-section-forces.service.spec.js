import { TestBed, inject } from '@angular/core/testing';
import { InputSectionForcesService } from './input-section-forces.service';
describe('InputSectionForcesService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputSectionForcesService]
        });
    });
    it('should be created', inject([InputSectionForcesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-section-forces.service.spec.js.map