'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrength
 * @description
 * # MaterialStrength
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrength', ['$lowArray', 'materialStrengthsConfig', 'HtHelper',
    function ($lowArray, materialStrengthsConfig, HtHelper) {

      let MaterialStrength = $lowArray({
        store: 'materialStrengths',
        foreignKeys: {
          parent: {
            Group: 'group_id',
          },
        },
      });

      function init() {
        MaterialStrength.nestedHeaders = HtHelper.parseNestedHeaders(materialStrengthsConfig, 0);
        MaterialStrength.columns = HtHelper.parseColumns(materialStrengthsConfig);
        return MaterialStrength;
      }

      return init();
    }
  ]);
