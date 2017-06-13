'use strict';

/**
 * @ngdoc service
 * @name webdan.CalculationPrint
 * @description
 * # CalculationPrint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('CalculationPrint', ['LowResource', 'calculationPrintConfig', 'HtHelper',
    function (LowResource, calculationPrintConfig, HtHelper) {

      let CalculationPrint = LowResource({
        store: 'calculationPrint',
      });

      _.mixin(CalculationPrint, HtHelper);

      return CalculationPrint;
    }
  ]);
