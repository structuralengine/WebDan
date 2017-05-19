'use strict';

describe('Service: config/bars', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/bars;
  beforeEach(inject(function (_config/bars_) {
    config/bars = _config/bars_;
  }));

  it('should do something', function () {
    expect(!!config/bars).toBe(true);
  });

});
