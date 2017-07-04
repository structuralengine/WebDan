'use strict';

describe('Service: nestedHeaders/fatigues.nh', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var nestedHeaders/fatigues.nh;
  beforeEach(inject(function (_nestedHeaders/fatigues.nh_) {
    nestedHeaders/fatigues.nh = _nestedHeaders/fatigues.nh_;
  }));

  it('should do something', function () {
    expect(!!nestedHeaders/fatigues.nh).toBe(true);
  });

});
