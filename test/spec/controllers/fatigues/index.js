'use strict';

describe('Controller: FatiguesIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var FatiguesIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FatiguesIndexCtrl = $controller('FatiguesIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
