'use strict';

describe('Service: htHelper', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var htHelper;
  beforeEach(inject(function (_htHelper_) {
    htHelper = _htHelper_;
  }));

  it('should do something', function () {
    expect(!!htHelper).toBe(true);
  });

});
