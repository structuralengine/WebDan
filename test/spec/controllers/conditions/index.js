'use strict';

describe('Controller: ConditionsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var ConditionsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConditionsIndexCtrl = $controller('ConditionsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
