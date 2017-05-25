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
        let config = MaterialStrengthRest.config = {};
        parseConfig(materialStrengthRestConfig, config);
      }

      function parseConfig(items, config) {
        config = config || {};
        Object.keys(items).forEach(function(key) {
          config[key] = {
            key: key,
            label: items[key].ja || null,
          };
        });
      }

      init();

      return MaterialStrengthRest;
    }
  ]);
