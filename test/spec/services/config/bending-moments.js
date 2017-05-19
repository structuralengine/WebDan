'use strict';

describe('Service: config/bendingMoments', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/bendingMoments;
  beforeEach(inject(function (_config/bendingMoments_) {
    config/bendingMoments = _config/bendingMoments_;
  }));

  it('should do something', function () {
    expect(!!config/bendingMoments).toBe(true);
  });

});
