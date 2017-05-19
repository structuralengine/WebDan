'use strict';

describe('Controller: DesignPointsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var DesignPointsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignPointsAddCtrl = $controller('DesignPointsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
