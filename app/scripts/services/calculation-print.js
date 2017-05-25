'use strict';

/**
 * @ngdoc service
 * @name webdan.CalculationPrint
 * @description
 * # CalculationPrint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('CalculationPrint', ['webdanRef', '$fbResource', 'calculationPrintConfig', 'HtHelper',
    function (webdanRef, $fbResource, calculationPrintConfig, HtHelper) {

      let CalculationPrint = $fbResource({
        ref: webdanRef.child('calculationPrint'),
      });

      function init() {
        let config = CalculationPrint.config = {};
        parseConfig(calculationPrintConfig, config);
      }

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

      init();

      return CalculationPrint;
    }
  ]);
