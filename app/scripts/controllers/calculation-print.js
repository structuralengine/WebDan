'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', '$window', '$filter', '$log', 'CalculationPrint', 'Member', 'calculationPrintConfig', 'RCNonlinear', 'appConfig',
    function ($scope, $window, $filter, $log, CalculationPrint, Member, calculationPrintConfig, RCNonlinear, appConfig) {
      let ctrl = this;

      ctrl.change = function(key) {
        CalculationPrint.save(ctrl.calculationPrint);
      };

      ctrl.submit = function(form) {
        let data = CalculationPrint.getStoredData();
        let json = angular.toJson(data);
        let key = appConfig.CalculationPrint.sessionStorageKey;
        sessionStorage.setItem(key, json);
        $window.open('result.html');
        form.$setPristine();
      };

      function init() {
        ctrl.config = calculationPrintConfig;
        ctrl.calculationPrint = CalculationPrint.query();

        ctrl.groups = Member.Group.query();
      }

      init();
    }
  ]);
