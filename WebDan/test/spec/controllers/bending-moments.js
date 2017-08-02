'use strict';

describe('Controller: BendingMomentsCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var BendingMomentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BendingMomentsCtrl = $controller('BendingMomentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
