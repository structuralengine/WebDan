'use strict';

describe('Controller: SectionForcesCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SectionForcesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SectionForcesCtrl = $controller('SectionForcesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
