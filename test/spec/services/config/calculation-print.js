'use strict';

describe('Service: config/calculationPrint', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/calculationPrint;
  beforeEach(inject(function (_config/calculationPrint_) {
    config/calculationPrint = _config/calculationPrint_;
  }));

  it('should do something', function () {
    expect(!!config/calculationPrint).toBe(true);
  });

});
