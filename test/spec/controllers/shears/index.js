'use strict';

describe('Controller: ShearsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var ShearsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShearsIndexCtrl = $controller('ShearsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
