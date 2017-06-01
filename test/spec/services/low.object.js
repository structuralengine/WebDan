'use strict';

describe('Service: low.object', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var low.object;
  beforeEach(inject(function (_low.object_) {
    low.object = _low.object_;
  }));

  it('should do something', function () {
    expect(!!low.object).toBe(true);
  });

});
