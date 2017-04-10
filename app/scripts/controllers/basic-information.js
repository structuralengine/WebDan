'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BasicInformationCtrl
 * @description
 * # BasicInformationCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BasicInformationCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
