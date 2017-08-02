'use strict';

describe('Service: defaults/bar.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/bar.defaults;
  beforeEach(inject(function (_defaults/bar.defaults_) {
    defaults/bar.defaults = _defaults/bar.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/bar.defaults).toBe(true);
  });

});
