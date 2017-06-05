'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsIndexCtrl
 * @description
 * # SafetyFactorsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsIndexCtrl', ['$scope', '$log', '$filter', 'SafetyFactor', 'Group', 'handsontableConfig',
    function($scope, $log, $filter, SafetyFactor, Group, handsontableConfig) {
      let ctrl = this;

      function init() {
        let columns = angular.copy(SafetyFactor.columns);

        ctrl.settings = handsontableConfig.create({
          rowHeaders: false,
          minSpareRows: 0,
          nestedHeaders: SafetyFactor.nestedHeaders,
          columns: columns,
          resource: SafetyFactor,
        });

        let safetyFactors = SafetyFactor.query();
        ctrl.groupedSafetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
          return safetyFactor.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
