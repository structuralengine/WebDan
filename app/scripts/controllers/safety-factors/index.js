'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsIndexCtrl
 * @description
 * # SafetyFactorsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsIndexCtrl', ['$scope', '$log', '$filter', 'SafetyFactor', 'Group',
    function($scope, $log, $filter, SafetyFactor, Group) {
      let ctrl = this;

      function init() {
        ctrl.settings = {
          rowHeaders: false,
          colHeaders: true,
          nestedHeaders: SafetyFactor.nestedHeaders,
          columns: SafetyFactor.columns
        };

        SafetyFactor.$query().then(function(safetyFactors) {
          ctrl.groupedSafetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
            return safetyFactor.group;
          });

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
