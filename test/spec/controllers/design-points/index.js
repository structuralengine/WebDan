'use strict';

describe('Controller: DesignPointsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var DesignPointsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignPointsIndexCtrl = $controller('DesignPointsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
