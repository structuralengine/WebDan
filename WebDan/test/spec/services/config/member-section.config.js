'use strict';

describe('Service: config/memberSection.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/memberSection.config;
  beforeEach(inject(function (_config/memberSection.config_) {
    config/memberSection.config = _config/memberSection.config_;
  }));

  it('should do something', function () {
    expect(!!config/memberSection.config).toBe(true);
  });

});
