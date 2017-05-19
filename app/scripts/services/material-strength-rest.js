'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrengthRest
 * @description
 * # MaterialStrengthRest
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrengthRest', ['webdanRef', '$fbResource', 'materialStrengthRestConfig', 'HtHelper',
    function (webdanRef, $fbResource, materialStrengthRestConfig, HtHelper) {

      let MaterialStrengthRest = $fbResource({
        ref: webdanRef.child('materialStrengthRest'),
        foreignKeysIn: {
          parent: {
            children: {
              MaterialStrengthRest: 'materialStrengthRest'
            },
          },
          entry: {
            parent: {
              Group: 'group'
            },
          },
        }
      });

      function init() {
        MaterialStrengthRest.nestedHeaders = HtHelper.parseNestedHeaders(materialStrengthRestConfig, 0);
        MaterialStrengthRest.columns = HtHelper.parseColumns(materialStrengthRestConfig);
      }

      init();

      return MaterialStrengthRest;
    }
  ]);
