'use strict';

describe('Controller: BasicInformationIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var BasicInformationIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BasicInformationIndexCtrl = $controller('BasicInformationIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
