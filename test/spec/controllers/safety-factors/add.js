'use strict';

describe('Controller: SafetyFactorsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SafetyFactorsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafetyFactorsAddCtrl = $controller('SafetyFactorsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
