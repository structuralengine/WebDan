'use strict';

describe('Service: app.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var app.config;
  beforeEach(inject(function (_app.config_) {
    app.config = _app.config_;
  }));

  it('should do something', function () {
    expect(!!app.config).toBe(true);
  });

});
