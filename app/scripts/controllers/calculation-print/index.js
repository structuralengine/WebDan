'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:CalculationPrintIndexCtrl
 * @description
 * # CalculationPrintIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('CalculationPrintIndexCtrl', ['$scope', 'Group', 'CalculationPrint',
    function ($scope, Group, CalculationPrint) {
      let ctrl = this;

      ctrl.settings = {
        columns: [
          {data: 'label', readOnly: true},
          {data: 'value', type: 'numeric', 'format': '0.1'},
        ],
        afterRender: function() {
        },
        afterChange: function(changes, soruce) {
          if (soruce != 'loadData') {
            let hot = this;
            changes.forEach(function(change) {
              let rowData = hot.getSourceDataAtRow(change[0]);
              update(rowData);
            })
          }
        },
      };

      function init() {
        ctrl.settings = CalculationPrint.config;

        ctrl.calculationPrint = CalculationPrint.get();
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
