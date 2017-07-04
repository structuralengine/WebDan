'use strict';

describe('Service: nestedHeaders/members.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/members.nh;
  beforeEach(inject(function (_nestedHeaders/members.nh_) {
    nestedHeaders/members.nh = _nestedHeaders/members.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/members.nh).toBe(true);
  });

});
