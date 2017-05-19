'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsAddCtrl
 * @description
 * # SafetyFactorsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsAddCtrl', ['$scope', '$log', '$filter', 'SafetyFactor', 'Group', 'appConfig',
    function($scope, $log, $filter, SafetyFactor, Group, appConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        SafetyFactor.$add(ctrl.safetyFactor)
          .then(function(safetyFactor) {
            ctrl.safetyFactor = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      function init() {
        ctrl.keys = appConfig.defaults.safetyFactors.keys;
        ctrl.considerRebars = appConfig.defaults.safetyFactors.considerRebars
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
