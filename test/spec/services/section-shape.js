'use strict';

describe('Service: SectionShape', function () {

  // load the service's module
  beforeEach(module('webdan'));

  // instantiate service
  var SectionShape;
  beforeEach(inject(function (_SectionShape_) {
    SectionShape = _SectionShape_;
  }));

  it('should do something', function () {
    expect(!!SectionShape).toBe(true);
  });

});
