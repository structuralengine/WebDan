'use strict';

describe('Service: nestedHeaders/safetyFactors.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/safetyFactors.nh;
  beforeEach(inject(function (_nestedHeaders/safetyFactors.nh_) {
    nestedHeaders/safetyFactors.nh = _nestedHeaders/safetyFactors.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/safetyFactors.nh).toBe(true);
  });

});
