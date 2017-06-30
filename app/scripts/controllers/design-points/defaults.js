'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsDefaultsCtrl
 * @description
 * # DesignPointsDefaultsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsDefaultsCtrl', ['$scope', 'designPointDefaults',
    function ($scope, designPointDefaults) {

      $scope.designPointDefaults = designPointDefaults;

    }
  ]);
