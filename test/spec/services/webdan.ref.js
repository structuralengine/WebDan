'use strict';

describe('Service: webdan.ref', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var webdan.ref;
  beforeEach(inject(function (_webdan.ref_) {
    webdan.ref = _webdan.ref_;
  }));

  it('should do something', function () {
    expect(!!webdan.ref).toBe(true);
  });

});
