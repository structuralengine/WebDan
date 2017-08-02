'use strict';

describe('Service: config/member.default', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/member.default;
  beforeEach(inject(function (_config/member.default_) {
    config/member.default = _config/member.default_;
  }));

  it('should do something', function () {
    expect(!!config/member.default).toBe(true);
  });

});
