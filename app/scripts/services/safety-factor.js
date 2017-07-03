'use strict';

/**
 * @ngdoc service
 * @name webdan.SafetyFactor
 * @description
 * # SafetyFactor
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SafetyFactor', ['LowResource', 'safetyFactorConfig', 'safetyFactorDefaults', 'considerRebarDefaults', 'HtHelper',
    function (LowResource, safetyFactorConfig, safetyFactorDefaults, considerRebarDefaults, HtHelper) {

      let SafetyFactor = LowResource({
        'table': 'safetyFactors',
        'foreignKeys': {
          'parents': {
            Group: 'g_no',
          },
        },
      });

      _.mixin(SafetyFactor, HtHelper);
      SafetyFactor.htInit(safetyFactorConfig);

      return SafetyFactor;
    }
  ]);
