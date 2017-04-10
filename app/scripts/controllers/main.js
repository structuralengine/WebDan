'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
