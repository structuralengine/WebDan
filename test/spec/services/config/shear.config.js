'use strict';

describe('Service: config/shear.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/shear.config;
  beforeEach(inject(function (_config/shear.config_) {
    config/shear.config = _config/shear.config_;
  }));

  it('should do something', function () {
    expect(!!config/shear.config).toBe(true);
  });

});
