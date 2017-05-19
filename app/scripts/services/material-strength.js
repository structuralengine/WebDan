'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrength
 * @description
 * # MaterialStrength
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrength', ['webdanRef', '$fbResource', 'materialStrengthsConfig', 'HtHelper',
    function (webdanRef, $fbResource, materialStrengthsConfig, HtHelper) {

      let MaterialStrength = $fbResource({
        ref: webdanRef.child('materialStrengths'),
        foreignKeysIn: {
          parent: {
            children: {
              MaterialStrength: 'materialStrengths'
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
        MaterialStrength.nestedHeaders = HtHelper.parseNestedHeaders(materialStrengthsConfig, 0);
        MaterialStrength.columns = HtHelper.parseColumns(materialStrengthsConfig);
      }

      init();

      return MaterialStrength;
    }
  ]);
