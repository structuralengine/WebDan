'use strict';

describe('Service: Fatigue', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var Fatigue;
  beforeEach(inject(function (_Fatigue_) {
    Fatigue = _Fatigue_;
  }));

  it('should do something', function () {
    expect(!!Fatigue).toBe(true);
  });

});
