'use strict';

describe('Service: handsontalbe.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var handsontalbe.config;
  beforeEach(inject(function (_handsontalbe.config_) {
    handsontalbe.config = _handsontalbe.config_;
  }));

  it('should do something', function () {
    expect(!!handsontalbe.config).toBe(true);
  });

});
