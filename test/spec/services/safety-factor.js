'use strict';

describe('Service: SafetyFactor', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var SafetyFactor;
  beforeEach(inject(function (_SafetyFactor_) {
    SafetyFactor = _SafetyFactor_;
  }));

  it('should do something', function () {
    expect(!!SafetyFactor).toBe(true);
  });

});
