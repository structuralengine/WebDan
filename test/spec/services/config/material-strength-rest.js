'use strict';

describe('Service: config/materialStrengthRest', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/materialStrengthRest;
  beforeEach(inject(function (_config/materialStrengthRest_) {
    config/materialStrengthRest = _config/materialStrengthRest_;
  }));

  it('should do something', function () {
    expect(!!config/materialStrengthRest).toBe(true);
  });

});
