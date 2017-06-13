'use strict';

describe('Service: config/designPoint.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/designPoint.config;
  beforeEach(inject(function (_config/designPoint.config_) {
    config/designPoint.config = _config/designPoint.config_;
  }));

  it('should do something', function () {
    expect(!!config/designPoint.config).toBe(true);
  });

});
