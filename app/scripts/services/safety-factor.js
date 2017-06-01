'use strict';

/**
 * @ngdoc service
 * @name webdan.SafetyFactor
 * @description
 * # SafetyFactor
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SafetyFactor', ['$lowArray', 'safetyFactorsConfig', 'HtHelper',
    function ($lowArray, safetyFactorsConfig, HtHelper) {

      let SafetyFactor = $lowArray({
        store: 'safetyFactors',
        foreignKeys: {
          parent: {
            Group: 'group_id',
          },
        }
      });

      function init() {
        SafetyFactor.nestedHeaders = HtHelper.parseNestedHeaders(safetyFactorsConfig, 1);
        SafetyFactor.columns = HtHelper.parseColumns(safetyFactorsConfig);
        return SafetyFactor;
      }

      return init();
    }
  ]);
