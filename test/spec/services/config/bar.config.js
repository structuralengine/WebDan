'use strict';

describe('Service: config/bar.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/bar.config;
  beforeEach(inject(function (_config/bar.config_) {
    config/bar.config = _config/bar.config_;
  }));

  it('should do something', function () {
    expect(!!config/bar.config).toBe(true);
  });

});
