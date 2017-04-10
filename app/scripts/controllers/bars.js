'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsCtrl
 * @description
 * # BarsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
