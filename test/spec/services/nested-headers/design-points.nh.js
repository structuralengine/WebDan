'use strict';

describe('Service: nestedHeaders/designPoints.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/designPoints.nh;
  beforeEach(inject(function (_nestedHeaders/designPoints.nh_) {
    nestedHeaders/designPoints.nh = _nestedHeaders/designPoints.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/designPoints.nh).toBe(true);
  });

});
