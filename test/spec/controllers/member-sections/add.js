'use strict';

describe('Controller: MemberSectionsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var MemberSectionsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemberSectionsAddCtrl = $controller('MemberSectionsAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
