'use strict';

describe('Service: MaterialStrength', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var MaterialStrength;
  beforeEach(inject(function (_MaterialStrength_) {
    MaterialStrength = _MaterialStrength_;
  }));

  it('should do something', function () {
    expect(!!MaterialStrength).toBe(true);
  });

});
