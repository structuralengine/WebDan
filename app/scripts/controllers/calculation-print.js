'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', '$filter', '$log', 'CalculationPrint', 'Member', 'calculationPrintConfig', 'RCNonlinear',
    function ($scope, $filter, $log, CalculationPrint, Member, calculationPrintConfig, RCNonlinear) {
      let ctrl = this;

      ctrl.change = function(key) {
        CalculationPrint.save(ctrl.calculationPrint);
      };

      ctrl.isFormDisabled = function(form) {
        ctrl.disabled = (form.$invalid || form.$submitted || form.$pristine);
        return ctrl.disabled;
      }

      function init() {
        ctrl.config = calculationPrintConfig;
        ctrl.calculationPrint = CalculationPrint.query();

        ctrl.groups = Member.Group.query();
      }

      init();
    }
  ]);
