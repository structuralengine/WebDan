'use strict';

/**
 * @ngdoc service
 * @name webdan.SafetyFactor
 * @description
 * # SafetyFactor
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SafetyFactor', ['webdanRef', '$fbResource', 'safetyFactorsConfig', 'HtHelper',
    function (webdanRef, $fbResource, safetyFactorsConfig, HtHelper) {

      let SafetyFactor = $fbResource({
        ref: webdanRef.child('safetyFactors'),
        foreignKeysIn: {
          parent: {
            children: {
              SafetyFactor: 'safetyFactors'
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
        SafetyFactor.nestedHeaders = HtHelper.parseNestedHeaders(safetyFactorsConfig, 1);
        SafetyFactor.columns = HtHelper.parseColumns(safetyFactorsConfig);
      }

      init();

      return SafetyFactor;
    }
  ]);
