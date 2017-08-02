'use strict';

describe('Service: config/safetyFactor.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/safetyFactor.config;
  beforeEach(inject(function (_config/safetyFactor.config_) {
    config/safetyFactor.config = _config/safetyFactor.config_;
  }));

  it('should do something', function () {
    expect(!!config/safetyFactor.config).toBe(true);
  });

});
