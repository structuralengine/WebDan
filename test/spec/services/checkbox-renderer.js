'use strict';

describe('Service: checkboxRenderer', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var checkboxRenderer;
  beforeEach(inject(function (_checkboxRenderer_) {
    checkboxRenderer = _checkboxRenderer_;
  }));

  it('should do something', function () {
    expect(!!checkboxRenderer).toBe(true);
  });

});
