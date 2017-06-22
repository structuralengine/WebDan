'use strict';

/**
 * @ngdoc service
 * @name webdan.Fatigue
 * @description
 * # Fatigue
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Fatigue', ['LowResource', 'fatigueConfig', 'HtHelper',
    function (LowResource, fatigueConfig, HtHelper) {

      let Fatigue = LowResource({
        'store': 'fatigues',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(Fatigue, HtHelper);

      Fatigue.htInit(fatigueConfig);

      return Fatigue;
    }
  ]);
