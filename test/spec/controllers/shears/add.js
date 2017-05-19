'use strict';

describe('Controller: ShearsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var ShearsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShearsAddCtrl = $controller('ShearsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
