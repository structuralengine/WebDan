'use strict';

describe('Service: config/designPoints', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/designPoints;
  beforeEach(inject(function (_config/designPoints_) {
    config/designPoints = _config/designPoints_;
  }));

  it('should do something', function () {
    expect(!!config/designPoints).toBe(true);
  });

});
