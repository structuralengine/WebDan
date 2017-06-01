'use strict';

describe('Service: low.db', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var low.db;
  beforeEach(inject(function (_low.db_) {
    low.db = _low.db_;
  }));

  it('should do something', function () {
    expect(!!low.db).toBe(true);
  });

});
