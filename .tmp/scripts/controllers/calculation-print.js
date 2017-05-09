'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */

angular.module('webdan').controller('CalculationPrintCtrl', ['$scope', '$uibModal', 'Calculation', function ($scope, $uibModal, Calculation) {

  var ctrl = this;

  ctrl.calcStart = function () {
    // うまく機能していない ↓
    $uibModal.open({
      templateUrl: Calculation.page(3, 2)
    });
    // とりあえず 代替 ↓
    window.open(Calculation.page(3, 2), '_blank');
  };
}]);;
//# sourceMappingURL=calculation-print.js.map
