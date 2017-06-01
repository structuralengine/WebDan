'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar', ['$lowArray', 'barsConfig', 'HtHelper',
    function ($lowArray, barsConfig, HtHelper) {

      let Bar = $lowArray({
        store: 'bars',
        foreignKeys: {
          parent: {
            DesignPoint: 'designPoint_id',
          },
        },
      });

      function init() {
        Bar.nestedHeaders = HtHelper.parseNestedHeaders(barsConfig, 2);
        Bar.columns = HtHelper.parseColumns(barsConfig);
        return Bar;
      }

      return init();
    }
  ]);
