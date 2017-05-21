'use strict';

describe('Service: config/basicInformation', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/basicInformation;
  beforeEach(inject(function (_config/basicInformation_) {
    config/basicInformation = _config/basicInformation_;
  }));

  it('should do something', function () {
    expect(!!config/basicInformation).toBe(true);
  });

});
