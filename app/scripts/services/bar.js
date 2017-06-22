'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar', ['LowResource', 'barConfig', 'HtHelper',
    function (LowResource, barConfig, HtHelper) {

      let Bar = LowResource({
        'store': 'bars',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(Bar, HtHelper);

      Bar.htInit(barConfig);

      return Bar;
    }
  ]);
