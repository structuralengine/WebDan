'use strict';

describe('Service: DesignPoint', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var DesignPoint;
  beforeEach(inject(function (_DesignPoint_) {
    DesignPoint = _DesignPoint_;
  }));

  it('should do something', function () {
    expect(!!DesignPoint).toBe(true);
  });

});
