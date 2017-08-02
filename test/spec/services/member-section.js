'use strict';

describe('Service: MemberSection', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var MemberSection;
  beforeEach(inject(function (_MemberSection_) {
    MemberSection = _MemberSection_;
  }));

  it('should do something', function () {
    expect(!!MemberSection).toBe(true);
  });

});
