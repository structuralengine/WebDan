'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', '$filter', 'CalculationPrint', 'Group', 'calculationPrintConfig',
    function ($scope, $filter, CalculationPrint, Group, calculationPrintConfig) {
      let ctrl = this;

      ctrl.change = function(key) {
        CalculationPrint.save(ctrl.calculationPrint);
      };

      function init() {
        ctrl.config = calculationPrintConfig;
        ctrl.calculationPrint = CalculationPrint.query();

        let groups = Group.query();
        ctrl.groups = $filter('orderBy')(groups, function(group) {
          return group.g_no;
        });
      }

      init();
    }
  ]);
