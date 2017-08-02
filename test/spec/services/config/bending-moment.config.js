'use strict';

describe('Service: config/bendingMoment.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/bendingMoment.config;
  beforeEach(inject(function (_config/bendingMoment.config_) {
    config/bendingMoment.config = _config/bendingMoment.config_;
  }));

  it('should do something', function () {
    expect(!!config/bendingMoment.config).toBe(true);
  });

});
