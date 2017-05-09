'use strict';

describe('Controller: MembersIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MembersIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MembersIndexCtrl = $controller('MembersIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
