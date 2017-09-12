'use strict';

angular.module('webdan')
  .factory('SafetyFactor', ['LowResource', 'safetyFactorConfig', 'safetyFactorDefaults', 'considerRebarDefaults', 'HtHelper',
    function (LowResource, safetyFactorConfig, safetyFactorDefaults, considerRebarDefaults, HtHelper) {

      let SafetyFactor = LowResource({
        'table': 'safetyFactors',
        'foreignKeys': {
          'parents': {
            Group: 'g_no'
          }
        }
      });

      _.mixin(SafetyFactor, HtHelper);
      SafetyFactor.htInit(safetyFactorConfig);

      return SafetyFactor;
    }
  ]);
