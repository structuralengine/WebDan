'use strict';

describe('Service: defaults/safetyFactor.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/safetyFactor.defaults;
  beforeEach(inject(function (_defaults/safetyFactor.defaults_) {
    defaults/safetyFactor.defaults = _defaults/safetyFactor.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/safetyFactor.defaults).toBe(true);
  });

});
