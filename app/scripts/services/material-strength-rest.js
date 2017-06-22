'use strict';

/**
 * @ngdoc service
 * @name webdan.MaterialStrengthRest
 * @description
 * # MaterialStrengthRest
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MaterialStrengthRest', ['$lowdb', 'LowResource', 'materialStrengthRestConfig', 'HtHelper',
    function ($lowdb, LowResource, materialStrengthRestConfig, HtHelper) {

      let MaterialStrengthRest = LowResource({
        'store': 'materialStrengthRests',
        'foreignKeys': {
          'parents': {
            Group: 'g_no',
          },
        },
      });

      _.mixin(MaterialStrengthRest, HtHelper);

      return MaterialStrengthRest;
    }
  ]);
