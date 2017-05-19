'use strict';

describe('Controller: SafetyFactorsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SafetyFactorsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafetyFactorsIndexCtrl = $controller('SafetyFactorsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
