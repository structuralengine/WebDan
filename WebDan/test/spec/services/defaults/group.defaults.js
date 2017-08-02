'use strict';

describe('Service: defaults/group.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/group.defaults;
  beforeEach(inject(function (_defaults/group.defaults_) {
    defaults/group.defaults = _defaults/group.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/group.defaults).toBe(true);
  });

});
