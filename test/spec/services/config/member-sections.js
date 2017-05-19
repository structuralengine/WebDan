'use strict';

describe('Service: config/memberSections', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/memberSections;
  beforeEach(inject(function (_config/memberSections_) {
    config/memberSections = _config/memberSections_;
  }));

  it('should do something', function () {
    expect(!!config/memberSections).toBe(true);
  });

});
