'use strict';

describe('Service: config/calculationPrint.config', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/calculationPrint.config;
  beforeEach(inject(function (_config/calculationPrint.config_) {
    config/calculationPrint.config = _config/calculationPrint.config_;
  }));

  it('should do something', function () {
    expect(!!config/calculationPrint.config).toBe(true);
  });

});
