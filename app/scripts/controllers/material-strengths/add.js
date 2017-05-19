'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthsAddCtrl
 * @description
 * # MaterialStrengthsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthsAddCtrl', ['$scope', '$log', '$filter', 'MaterialStrength', 'Group', 'appConfig',
    function($scope, $log, $filter, MaterialStrength, Group, appConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        MaterialStrength.$add(ctrl.materialStrength)
          .then(function(materialStrength) {
            ctrl.materialStrength = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      function init() {
        ctrl.bars = appConfig.defaults.materialStrengths.bars;
        ctrl.ranges = appConfig.defaults.materialStrengths.ranges;
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
