'use strict';

describe('Controller: DesignPointsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var DesignPointsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignPointsCtrl = $controller('DesignPointsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
