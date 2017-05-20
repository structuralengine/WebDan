'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintIndexCtrl
 * @description
 * # CalculationPrintIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintIndexCtrl', ['$scope', 'Group',
    function ($scope, Group) {
      let ctrl = this;

      function init() {
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
