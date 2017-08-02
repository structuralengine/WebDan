'use strict';

describe('Service: config/member.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/member.config;
  beforeEach(inject(function (_config/member.config_) {
    config/member.config = _config/member.config_;
  }));

  it('should do something', function () {
    expect(!!config/member.config).toBe(true);
  });

});
