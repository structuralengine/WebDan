'use strict';

describe('Service: Shear', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var Shear;
  beforeEach(inject(function (_Shear_) {
    Shear = _Shear_;
  }));

  it('should do something', function () {
    expect(!!Shear).toBe(true);
  });

});
