'use strict';

describe('Service: config/fatigues', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var config/fatigues;
  beforeEach(inject(function (_config/fatigues_) {
    config/fatigues = _config/fatigues_;
  }));

  it('should do something', function () {
    expect(!!config/fatigues).toBe(true);
  });

});
