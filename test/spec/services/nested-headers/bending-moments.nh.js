'use strict';

describe('Service: nestedHeaders/bendingMoments.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/bendingMoments.nh;
  beforeEach(inject(function (_nestedHeaders/bendingMoments.nh_) {
    nestedHeaders/bendingMoments.nh = _nestedHeaders/bendingMoments.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/bendingMoments.nh).toBe(true);
  });

});
