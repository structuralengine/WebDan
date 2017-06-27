'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrength
 * @description
 * # MaterialStrength
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrength', ['LowResource', 'materialStrengthConfig', 'HtHelper',
    function (LowResource, materialStrengthConfig, HtHelper) {

      let MaterialStrength = LowResource({
        'table': 'materialStrengths',
        'foreignKeys': {
          'parents': {
            Group: 'g_no',
          },
        },
      });

      _.mixin(MaterialStrength, HtHelper);

      MaterialStrength.htInit(materialStrengthConfig);

      return MaterialStrength;
    }
  ]);
