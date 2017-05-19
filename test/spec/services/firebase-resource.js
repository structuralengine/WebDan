'use strict';

describe('Service: firebaseResource', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var firebaseResource;
  beforeEach(inject(function (_firebaseResource_) {
    firebaseResource = _firebaseResource_;
  }));

  it('should do something', function () {
    expect(!!firebaseResource).toBe(true);
  });

});
