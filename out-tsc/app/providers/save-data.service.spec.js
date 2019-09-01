import { TestBed, inject } from '@angular/core/testing';
import { SaveDataService } from './save-data.service';
describe('SaveDataService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [SaveDataService]
        });
    });
    it('should be created', inject([SaveDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=save-data.service.spec.js.map