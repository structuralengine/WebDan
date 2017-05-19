'use strict';

describe('Service: config/shears', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/shears;
  beforeEach(inject(function (_config/shears_) {
    config/shears = _config/shears_;
  }));

  it('should do something', function () {
    expect(!!config/shears).toBe(true);
  });

});
