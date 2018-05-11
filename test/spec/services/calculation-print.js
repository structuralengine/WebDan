'use strict';

describe('Service: CalculationPrint', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var CalculationPrint;
  beforeEach(inject(function (_CalculationPrint_) {
    CalculationPrint = _CalculationPrint_;
  }));

  it('should do something', function () {
    expect(!!CalculationPrint).toBe(true);
  });

});
