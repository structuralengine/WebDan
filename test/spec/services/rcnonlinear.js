'use strict';

describe('Service: RCNonlinear', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var RCNonlinear;
  beforeEach(inject(function (_RCNonlinear_) {
    RCNonlinear = _RCNonlinear_;
  }));

  it('should do something', function () {
    expect(!!RCNonlinear).toBe(true);
  });

});
