'use strict';

describe('Service: defaults/considerRebar.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/considerRebar.defaults;
  beforeEach(inject(function (_defaults/considerRebar.defaults_) {
    defaults/considerRebar.defaults = _defaults/considerRebar.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/considerRebar.defaults).toBe(true);
  });

});
