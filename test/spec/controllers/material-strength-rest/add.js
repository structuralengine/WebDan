'use strict';

describe('Controller: MaterialStrengthRestAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthRestAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthRestAddCtrl = $controller('MaterialStrengthRestAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
