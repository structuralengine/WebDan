'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsIndexCtrl
 * @description
 * # BarsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsIndexCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
