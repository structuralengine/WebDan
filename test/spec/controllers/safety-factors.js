'use strict';

describe('Controller: SafetyFactorsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SafetyFactorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafetyFactorsCtrl = $controller('SafetyFactorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
