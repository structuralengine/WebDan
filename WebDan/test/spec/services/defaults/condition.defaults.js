'use strict';

describe('Service: defaults/condition.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/condition.defaults;
  beforeEach(inject(function (_defaults/condition.defaults_) {
    defaults/condition.defaults = _defaults/condition.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/condition.defaults).toBe(true);
  });

});
