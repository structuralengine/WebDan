'use strict';

describe('Service: defaults/fatigue.defaults', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var defaults/fatigue.defaults;
  beforeEach(inject(function (_defaults/fatigue.defaults_) {
    defaults/fatigue.defaults = _defaults/fatigue.defaults_;
  }));

  it('should do something', function () {
    expect(!!defaults/fatigue.defaults).toBe(true);
  });

});
