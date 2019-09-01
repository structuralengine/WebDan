import { TestBed, inject } from '@angular/core/testing';
import { InputMembersService } from './input-members.service';
describe('InputMembersService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [InputMembersService]
        });
    });
    it('should be created', inject([InputMembersService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=input-members.service.spec.js.map