'use strict';

describe('Service: Bar', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var Bar;
  beforeEach(inject(function (_Bar_) {
    Bar = _Bar_;
  }));

  it('should do something', function () {
    expect(!!Bar).toBe(true);
  });

});
