'use strict';

describe('Service: Member', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var Member;
  beforeEach(inject(function (_Member_) {
    Member = _Member_;
  }));

  it('should do something', function () {
    expect(!!Member).toBe(true);
  });

});
