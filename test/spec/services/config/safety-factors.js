'use strict';

describe('Service: config/safetyFactors', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/safetyFactors;
  beforeEach(inject(function (_config/safetyFactors_) {
    config/safetyFactors = _config/safetyFactors_;
  }));

  it('should do something', function () {
    expect(!!config/safetyFactors).toBe(true);
  });

});
