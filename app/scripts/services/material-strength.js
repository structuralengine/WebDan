'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrength
 * @description
 * # MaterialStrength
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrength', ['$lowArray', 'materialStrengthsConfig', 'appConfig', 'HtHelper',
    function ($lowArray, materialStrengthsConfig, appConfig, HtHelper) {

      let MaterialStrength = $lowArray({
        store: 'materialStrengths',
        foreignKeys: {
          parent: {
            Group: 'g_no',
          },
        },
      });

      function init() {
        MaterialStrength.nestedHeaders = HtHelper.parseNestedHeaders(materialStrengthsConfig, 0);
        MaterialStrength.columns = HtHelper.parseColumns(materialStrengthsConfig);
        MaterialStrength.parseColumns(MaterialStrength.columns);

        MaterialStrength.columns.forEach(function(column) {
          switch (column.data) {
            case 'bar':
              let bars = appConfig.defaults.materialStrengths.bars;
              column.renderer = MaterialStrength.getSelectRenderer(bars, 'name');
              break;

            case 'range':
              let ranges = appConfig.defaults.materialStrengths.ranges;
              column.renderer = MaterialStrength.getSelectRenderer(ranges, 'name');
              break;
            default:
              break;
          }
        })

        return MaterialStrength;
      }

      return init();
    }
  ]);
