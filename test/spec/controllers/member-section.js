'use strict';

describe('Controller: MemberSectionCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MemberSectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemberSectionCtrl = $controller('MemberSectionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
