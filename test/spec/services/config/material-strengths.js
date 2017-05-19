'use strict';

describe('Service: config/materialStrengths', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/materialStrengths;
  beforeEach(inject(function (_config/materialStrengths_) {
    config/materialStrengths = _config/materialStrengths_;
  }));

  it('should do something', function () {
    expect(!!config/materialStrengths).toBe(true);
  });

});
