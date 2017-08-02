'use strict';

describe('Service: config/fatigue.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/fatigue.config;
  beforeEach(inject(function (_config/fatigue.config_) {
    config/fatigue.config = _config/fatigue.config_;
  }));

  it('should do something', function () {
    expect(!!config/fatigue.config).toBe(true);
  });

});
