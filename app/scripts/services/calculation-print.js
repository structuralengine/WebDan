'use strict';

/**
 * @ngdoc service
 * @name webdan.CalculationPrint
 * @description
 * # CalculationPrint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('CalculationPrint', ['$lowObject', 'calculationPrintConfig', 'HtHelper',
    function ($lowObject, calculationPrintConfig, HtHelper) {

      let CalculationPrint = $lowObject({
        store: 'calculationPrint',
      });

      function parseConfig(items, config) {
        config = config || {};
        Object.keys(items).forEach(function(key) {
          if (angular.isDefined(items[key].items)) {
            config[key] = {};
            parseConfig(items[key].items, config[key]);
          }
          else {
            config[key] = {
              key: key,
              label: items[key].ja || null
            };
          }
        });
      }

      function init() {
        let config = CalculationPrint.config = {};
        parseConfig(calculationPrintConfig, config);
        return CalculationPrint;
      }

      return init();
    }
  ]);
