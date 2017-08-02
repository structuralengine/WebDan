'use strict';

describe('Controller: FatiguesCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var FatiguesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FatiguesCtrl = $controller('FatiguesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
