'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', '$filter', 'CalculationPrint', 'Member', 'calculationPrintConfig',
    function ($scope, $filter, CalculationPrint, Member, calculationPrintConfig) {
      let ctrl = this;

      ctrl.change = function(key) {
        CalculationPrint.save(ctrl.calculationPrint);
      };

      function init() {
        ctrl.config = calculationPrintConfig;
        ctrl.calculationPrint = CalculationPrint.query();

        ctrl.groups = Member.Group.query();
      }

      init();
    }
  ]);
