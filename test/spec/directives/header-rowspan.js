'use strict';

describe('Directive: headerRowspan', function () {

  // load the directive's module
  beforeEach(module('srcApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<header-rowspan></header-rowspan>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the headerRowspan directive');
  }));
});
