import { TestBed, inject } from '@angular/core/testing';
import { UserInfoService } from './user-info.service';
describe('UserInfoService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [UserInfoService]
        });
    });
    it('should be created', inject([UserInfoService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=user-info.service.spec.js.map