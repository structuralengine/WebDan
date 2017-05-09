'use strict';

describe('Controller: DesignPointCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var DesignPointCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignPointCtrl = $controller('DesignPointCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
