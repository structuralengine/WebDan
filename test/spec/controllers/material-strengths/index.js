'use strict';

describe('Controller: MaterialStrengthsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthsIndexCtrl = $controller('MaterialStrengthsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
