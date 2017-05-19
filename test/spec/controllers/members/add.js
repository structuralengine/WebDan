'use strict';

describe('Controller: MembersAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MembersAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MembersAddCtrl = $controller('MembersAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
