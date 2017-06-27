'use strict';
/**
 * @ngdoc function
 * @name webdan.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('webdan')
  .controller('LoginCtrl', ['$scope', '$window', '$location', 'Auth',
    function ($scope, $window, $location, Auth) {
      let ctrl = this;

      ctrl.submit = function(form) {
        $scope.err = null;

        Auth.signIn(ctrl.user,
          function(response) {
            $location.path('/');
          }, function(err) {
            $window.alert(err);
          });
      };
    }
  ]);
