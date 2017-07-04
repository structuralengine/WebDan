'use strict';

describe('Service: nestedHeaders/bars.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/bars.nh;
  beforeEach(inject(function (_nestedHeaders/bars.nh_) {
    nestedHeaders/bars.nh = _nestedHeaders/bars.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/bars.nh).toBe(true);
  });

});
