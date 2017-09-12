'use strict';

angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', '$window', '$filter', '$log', '$location', 'CalculationPrint', 'Member', 'calculationPrintConfig', 'RCNonlinear', 'appConfig',
    function ($scope, $window, $filter, $log, $location, CalculationPrint, Member, calculationPrintConfig, RCNonlinear, appConfig) {
      let ctrl = this;

      ctrl.change = function(key) {
        CalculationPrint.save(ctrl.calculationPrint);
      };

      ctrl.submit = function(form) {
        $window.open(appConfig.CalculationPrint.calculatePage);
        form.$setPristine();
      };

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.config = calculationPrintConfig;
        ctrl.calculationPrint = CalculationPrint.query();

        ctrl.groups = Member.Group.query();
      }

      init();
    }
  ]);
