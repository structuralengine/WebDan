'use strict';

describe('Controller: MaterialStrengthsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthsAddCtrl = $controller('MaterialStrengthsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
