'use strict';

describe('Service: defaults/bendingMoment.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/bendingMoment.defaults;
  beforeEach(inject(function (_defaults/bendingMoment.defaults_) {
    defaults/bendingMoment.defaults = _defaults/bendingMoment.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/bendingMoment.defaults).toBe(true);
  });

});
