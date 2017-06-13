'use strict';

describe('Controller: MaterialStrengthsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthsCtrl = $controller('MaterialStrengthsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
