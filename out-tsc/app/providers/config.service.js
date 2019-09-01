import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var ConfigService = /** @class */ (function () {
    function ConfigService() {
    }
    ConfigService.prototype.nativeGlobal = function () { return window; };
    ConfigService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ConfigService);
    return ConfigService;
}());
export { ConfigService };
//# sourceMappingURL=config.service.js.map