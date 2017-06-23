'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalcCtrl
 * @description
 * # CalcCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalcCtrl', ['$scope', 'CalculationPrint', 'RCNonlinear',
    function ($scope, CalculationPrint, RCNonlinear) {
      let ctrl = this;

      function init() {
        let data = CalculationPrint.getStoredData();
        RCNonlinear.send(data,
          function(response) {
            ctrl.response = angular.toJson(response);
          }, function(err) {
            $log.error(err);
          });
      }

      init();
    }
  ]);
