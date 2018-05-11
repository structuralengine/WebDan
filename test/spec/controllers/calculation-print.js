'use strict';

describe('Controller: CalculationPrintCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var CalculationPrintCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalculationPrintCtrl = $controller('CalculationPrintCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
