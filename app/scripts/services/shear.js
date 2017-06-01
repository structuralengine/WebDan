'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['$lowArray', 'shearsConfig', 'HtHelper',
    function ($lowArray, shearsConfig, HtHelper) {

      let Shear = $lowArray({
        store: 'shears',
        foreignKeys: {
          parent: {
            DesignPoint: 'designPoint_id',
          },
        },
      });

      function init() {
        let maxDepth = 2;
        Shear.nestedHeaders = HtHelper.parseNestedHeaders(shearsConfig, maxDepth);
        Shear.columns = HtHelper.parseColumns(shearsConfig);
        return Shear;
      }

      return init();
    }
  ]);
