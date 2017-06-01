'use strict';

/**
 * @ngdoc service
 * @name webdan.BasicInformation
 * @description
 * # BasicInformation
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BasicInformation', ['$lowObject', 'basicInformationConfig', 'HtHelper',
    function ($lowObject, basicInformationConfig, HtHelper) {

      let BasicInformation = $lowObject({
        store: 'basicInformation',
      });

      function parseConfig(items, config) {
        config = config || {};
        Object.keys(items).forEach(function(key) {
          config[key] = {
            key: key,
            label: items[key].ja || null
          };
          if (angular.isDefined(items[key].items)) {
            config[key].items = {};
            parseConfig(items[key].items, config[key].items);
          }
        });
      }

      function init() {
        let config = BasicInformation.config = {};
        parseConfig(basicInformationConfig, config);
        return BasicInformation;
      }

      return init();
    }
  ]);
