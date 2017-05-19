'use strict';

/**
 * @ngdoc service
 * @name webdan.Fatigue
 * @description
 * # Fatigue
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Fatigue', ['webdanRef', '$fbResource', 'fatiguesConfig', 'HtHelper',
    function (webdanRef, $fbResource, fatiguesConfig, HtHelper) {

      let Fatigue = $fbResource({
        ref: webdanRef.child('fatigues'),
        foreignKeysIn: {
          parent: {
            children: {
              Fatigue: 'fatigues'
            },
          },
          entry: {
            parent: {
              DesignPoint: 'designPoint'
            },
          },
        }
      });

      function init() {
        Fatigue.nestedHeaders = HtHelper.parseNestedHeaders(fatiguesConfig, 2);
        Fatigue.nestedHeaders[2].splice(0, 0, '', '', '');
        Fatigue.columns = HtHelper.parseColumns(fatiguesConfig);
      }

      init();

      return Fatigue;
    }
  ]);
