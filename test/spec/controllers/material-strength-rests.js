'use strict';

describe('Controller: MaterialStrengthRestsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MaterialStrengthRestsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialStrengthRestsCtrl = $controller('MaterialStrengthRestsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
