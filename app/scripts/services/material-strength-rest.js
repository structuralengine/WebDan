'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrengthRest
 * @description
 * # MaterialStrengthRest
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrengthRest', ['$lowObject', 'materialStrengthRestConfig', 'HtHelper',
    function ($lowObject, materialStrengthRestConfig, HtHelper) {

      let MaterialStrengthRest = $lowObject({
        store: 'materialStrengthRest',
        foreignKeys: {
          parent: {
            Group: 'group_id',
          },
        },
      });

      function parseConfig(items, config) {
        config = config || {};
        Object.keys(items).forEach(function(key) {
          config[key] = {
            key: key,
            label: items[key].ja || null,
          };
        });
      }

      function init() {
        let config = MaterialStrengthRest.config = {};
        parseConfig(materialStrengthRestConfig, config);
        return MaterialStrengthRest;
      }

      return init();
    }
  ]);
