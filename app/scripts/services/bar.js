'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar', ['webdanRef', '$fbResource', 'barsConfig', 'HtHelper',
    function (webdanRef, $fbResource, barsConfig, HtHelper) {

      let Bar = $fbResource({
        ref: webdanRef.child('bars'),
        foreignKeysIn: {
          parent: {
            children: {
              Bar: 'bars'
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
        Bar.nestedHeaders = HtHelper.parseNestedHeaders(barsConfig, 2);
        Bar.columns = HtHelper.parseColumns(barsConfig);
      }

      init();

      return Bar;
    }
  ]);
