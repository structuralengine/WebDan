'use strict';

describe('Service: config/groups', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/groups;
  beforeEach(inject(function (_config/groups_) {
    config/groups = _config/groups_;
  }));

  it('should do something', function () {
    expect(!!config/groups).toBe(true);
  });

});
