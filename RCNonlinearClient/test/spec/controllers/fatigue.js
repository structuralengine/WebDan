'use strict';

describe('Controller: FatigueCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var FatigueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FatigueCtrl = $controller('FatigueCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
