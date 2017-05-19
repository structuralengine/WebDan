'use strict';

describe('Controller: MaterialStrengthRestIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthRestIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthRestIndexCtrl = $controller('MaterialStrengthRestIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
