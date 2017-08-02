'use strict';

describe('Service: BasicInformation', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var BasicInformation;
  beforeEach(inject(function (_BasicInformation_) {
    BasicInformation = _BasicInformation_;
  }));

  it('should do something', function () {
    expect(!!BasicInformation).toBe(true);
  });

});
