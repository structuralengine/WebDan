import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './config.service';
describe('ConfigService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ConfigService]
        });
    });
    it('should be created', inject([ConfigService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=config.service.spec.js.map