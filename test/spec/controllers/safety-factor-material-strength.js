'use strict';

describe('Controller: SafetyFactorMaterialStrengthCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SafetyFactorMaterialStrengthCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafetyFactorMaterialStrengthCtrl = $controller('SafetyFactorMaterialStrengthCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
