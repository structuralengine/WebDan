'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['webdanRef', '$fbResource', 'shearsConfig', 'HtHelper',
    function (webdanRef, $fbResource, shearsConfig, HtHelper) {

      let Shear = $fbResource({
        ref: webdanRef.child('shears'),
        foreignKeysIn: {
          parent: {
            children: {
              Shear: 'shears'
            }
          },
          entry: {
            parent: {
              DesignPoint: 'designPoint'
            }
          }
        }
      });

      function init() {
        let maxDepth = 2;
        Shear.nestedHeaders = HtHelper.parseNestedHeaders(shearsConfig, maxDepth);
        Shear.columns = HtHelper.parseColumns(shearsConfig);
      }

      init();

      return Shear;
    }
  ]);
