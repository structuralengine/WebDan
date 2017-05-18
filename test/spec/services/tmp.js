'use strict';

describe('Service: tmp.data', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var tmp.data;
  beforeEach(inject(function (_tmp.data_) {
    tmp.data = _tmp.data_;
  }));

  it('should do something', function () {
    expect(!!tmp.data).toBe(true);
  });

});
