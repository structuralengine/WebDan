'use strict';

describe('Controller: BendingMomentsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var BendingMomentsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BendingMomentsIndexCtrl = $controller('BendingMomentsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
