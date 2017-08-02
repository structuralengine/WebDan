'use strict';

describe('Service: config/msg.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/msg.config;
  beforeEach(inject(function (_config/msg.config_) {
    config/msg.config = _config/msg.config_;
  }));

  it('should do something', function () {
    expect(!!config/msg.config).toBe(true);
  });

});
