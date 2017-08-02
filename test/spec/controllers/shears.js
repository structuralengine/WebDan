'use strict';

describe('Controller: ShearsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var ShearsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShearsCtrl = $controller('ShearsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
