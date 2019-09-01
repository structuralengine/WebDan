import { TestBed, inject } from '@angular/core/testing';
import { InputDesignPointsService } from './input-design-points.service';
describe('InputDesignPointsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputDesignPointsService]
        });
    });
    it('should be created', inject([InputDesignPointsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-design-points.service.spec.js.map