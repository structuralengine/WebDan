'use strict';

describe('Controller: DesignPointsDefaultsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var DesignPointsDefaultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignPointsDefaultsCtrl = $controller('DesignPointsDefaultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
