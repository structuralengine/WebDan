'use strict';

describe('Controller: MemberSectionIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MemberSectionIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemberSectionIndexCtrl = $controller('MemberSectionIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
