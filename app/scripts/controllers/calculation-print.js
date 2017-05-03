'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintCtrl
 * @description
 * # CalculationPrintCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintCtrl', ['$scope', 'CalcService',
    function ($scope, calcService) {
      var ctrl = this;
      ctrl.calcStart = function () {
         calcService.calcStart(); 
      };
    }
  ]);
