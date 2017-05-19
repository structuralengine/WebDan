'use strict';

describe('Controller: GroupsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var GroupsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupsAddCtrl = $controller('GroupsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
