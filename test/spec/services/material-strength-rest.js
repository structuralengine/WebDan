'use strict';

describe('Service: MaterialStrengthRest', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var MaterialStrengthRest;
  beforeEach(inject(function (_MaterialStrengthRest_) {
    MaterialStrengthRest = _MaterialStrengthRest_;
  }));

  it('should do something', function () {
    expect(!!MaterialStrengthRest).toBe(true);
  });

});
