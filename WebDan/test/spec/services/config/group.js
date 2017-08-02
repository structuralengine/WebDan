'use strict';

describe('Service: config/group', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/group;
  beforeEach(inject(function (_config/group_) {
    config/group = _config/group_;
  }));

  it('should do something', function () {
    expect(!!config/group).toBe(true);
  });

});
