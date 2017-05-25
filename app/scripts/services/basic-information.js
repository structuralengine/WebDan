'use strict';

/**
 * @ngdoc service
 * @name webdan.BasicInformation
 * @description
 * # BasicInformation
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BasicInformation', ['webdanRef', '$fbResource', 'basicInformationConfig', 'HtHelper',
    function (webdanRef, $fbResource, basicInformationConfig, HtHelper) {

      let BasicInformation = $fbResource({
        ref: webdanRef.child('basicInformation'),
      });

      function init() {
        let config = BasicInformation.config = {};
        parseItems(basicInformationConfig, config);
      }

      function parseItems(items, config) {
        config = config || {};
        Object.keys(items).forEach(function(key) {
          if (angular.isDefined(items[key].items)) {
            config[key] = {};
            parseItems(items[key].items, config[key]);
          }
          else {
            config[key] = {
              key: key,
              label: items[key].ja || null
            };
          }
        });
      }

      init();

      return BasicInformation;
    }
  ]);
