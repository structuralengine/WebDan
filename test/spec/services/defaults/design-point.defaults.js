'use strict';

describe('Service: defaults/designPoint.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/designPoint.defaults;
  beforeEach(inject(function (_defaults/designPoint.defaults_) {
    defaults/designPoint.defaults = _defaults/designPoint.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/designPoint.defaults).toBe(true);
  });

});
