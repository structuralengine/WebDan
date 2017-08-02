'use strict';

describe('Controller: SafetyFactorsMaterialStrengthsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SafetyFactorsMaterialStrengthsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafetyFactorsMaterialStrengthsCtrl = $controller('SafetyFactorsMaterialStrengthsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
