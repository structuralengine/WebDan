'use strict';

describe('Service: nestedHeaders/shears.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/shears.nh;
  beforeEach(inject(function (_nestedHeaders/shears.nh_) {
    nestedHeaders/shears.nh = _nestedHeaders/shears.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/shears.nh).toBe(true);
  });

});
