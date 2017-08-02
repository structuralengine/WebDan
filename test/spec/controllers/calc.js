'use strict';

describe('Controller: CalcCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var CalcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalcCtrl = $controller('CalcCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
