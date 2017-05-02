'use strict';

describe('Controller: WordsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('webdan'));

  var WordsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WordsIndexCtrl = $controller('WordsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
