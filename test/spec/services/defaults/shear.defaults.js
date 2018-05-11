'use strict';

describe('Service: defaults/shear.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/shear.defaults;
  beforeEach(inject(function (_defaults/shear.defaults_) {
    defaults/shear.defaults = _defaults/shear.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/shear.defaults).toBe(true);
  });

});
