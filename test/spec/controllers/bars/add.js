'use strict';

describe('Controller: BarsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var BarsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BarsAddCtrl = $controller('BarsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
