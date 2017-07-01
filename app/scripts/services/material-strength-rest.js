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
        'table': 'materialStrengthRests',
        'foreignKeys': {
          'parents': {
            Group: 'g_no',
          },
        },
      });

      _.mixin(MaterialStrengthRest, HtHelper);

      MaterialStrengthRest.createDefaultEntries = function(foreignKey, foreignValue) {
        MaterialStrengthRest.save({
          g_no: foreignValue,
        });
      }

      return MaterialStrengthRest;
    }
  ]);
