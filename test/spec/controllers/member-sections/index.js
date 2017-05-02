'use strict';

describe('Controller: MemberSectionsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MemberSectionsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemberSectionsIndexCtrl = $controller('MemberSectionsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
