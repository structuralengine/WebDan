'use strict';

describe('Controller: SectionShapesIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var SectionShapesIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SectionShapesIndexCtrl = $controller('SectionShapesIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
