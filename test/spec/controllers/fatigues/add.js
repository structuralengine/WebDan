'use strict';

describe('Controller: FatiguesAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var FatiguesAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FatiguesAddCtrl = $controller('FatiguesAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
