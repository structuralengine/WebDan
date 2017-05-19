'use strict';

describe('Service: config/members', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/members;
  beforeEach(inject(function (_config/members_) {
    config/members = _config/members_;
  }));

  it('should do something', function () {
    expect(!!config/members).toBe(true);
  });

});
