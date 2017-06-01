'use strict';

/**
 * @ngdoc service
 * @name webdan.Fatigue
 * @description
 * # Fatigue
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Fatigue', ['$lowArray', 'fatiguesConfig', 'HtHelper',
    function ($lowArray, fatiguesConfig, HtHelper) {

      let Fatigue = $lowArray({
        store: 'fatigues',
        foreignKeys: {
          parent: {
            DesignPoint: 'designPoint_id'
          },
        },
      });

      function init() {
        Fatigue.nestedHeaders = HtHelper.parseNestedHeaders(fatiguesConfig, 2);
        Fatigue.nestedHeaders[2].splice(0, 0, '', '', '');
        Fatigue.columns = HtHelper.parseColumns(fatiguesConfig);
        return Fatigue;
      }

      return init();
    }
  ]);
