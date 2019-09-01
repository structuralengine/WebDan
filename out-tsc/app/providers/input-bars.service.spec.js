import { TestBed, inject } from '@angular/core/testing';
import { InputBarsService } from './input-bars.service';
describe('InputBarsService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputBarsService]
        });
    });
    it('should be created', inject([InputBarsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-bars.service.spec.js.map