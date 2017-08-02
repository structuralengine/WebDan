'use strict';

describe('Service: BendingMoment', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var BendingMoment;
  beforeEach(inject(function (_BendingMoment_) {
    BendingMoment = _BendingMoment_;
  }));

  it('should do something', function () {
    expect(!!BendingMoment).toBe(true);
  });

});
