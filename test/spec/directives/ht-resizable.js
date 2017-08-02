'use strict';

describe('Directive: htResizable', function () {

  // load the directive's module
  beforeEach(module('webdan'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ht-resizable></ht-resizable>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the htResizable directive');
  }));
});
