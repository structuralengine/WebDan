'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsAddCtrl
 * @description
 * # SafetyFactorsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsAddCtrl', ['$scope', '$log', '$filter', 'SafetyFactor', 'Group',
    function($scope, $log, $filter, SafetyFactor, Group) {
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
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
