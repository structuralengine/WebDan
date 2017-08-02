'use strict';

describe('Service: config/MaterialStrengthRest.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/MaterialStrengthRest.config;
  beforeEach(inject(function (_config/MaterialStrengthRest.config_) {
    config/MaterialStrengthRest.config = _config/MaterialStrengthRest.config_;
  }));

  it('should do something', function () {
    expect(!!config/MaterialStrengthRest.config).toBe(true);
  });

});
