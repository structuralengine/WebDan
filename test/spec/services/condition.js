'use strict';

describe('Service: Condition', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var Condition;
  beforeEach(inject(function (_Condition_) {
    Condition = _Condition_;
  }));

  it('should do something', function () {
    expect(!!Condition).toBe(true);
  });

});
