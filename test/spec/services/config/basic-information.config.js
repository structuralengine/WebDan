'use strict';

describe('Service: config/basicInformation.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/basicInformation.config;
  beforeEach(inject(function (_config/basicInformation.config_) {
    config/basicInformation.config = _config/basicInformation.config_;
  }));

  it('should do something', function () {
    expect(!!config/basicInformation.config).toBe(true);
  });

});
