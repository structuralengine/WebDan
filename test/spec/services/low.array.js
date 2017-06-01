'use strict';

describe('Service: low.array', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var low.array;
  beforeEach(inject(function (_low.array_) {
    low.array = _low.array_;
  }));

  it('should do something', function () {
    expect(!!low.array).toBe(true);
  });

});
