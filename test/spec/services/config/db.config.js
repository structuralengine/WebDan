'use strict';

describe('Service: config/db.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/db.config;
  beforeEach(inject(function (_config/db.config_) {
    config/db.config = _config/db.config_;
  }));

  it('should do something', function () {
    expect(!!config/db.config).toBe(true);
  });

});
