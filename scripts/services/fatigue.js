'use strict';

angular.module('webdan')
  .factory('Fatigue', ['LowResource', 'fatigueConfig', 'fatigueDefaults', 'HtHelper',
    function (LowResource, fatigueConfig, fatigueDefaults, HtHelper) {

      let Fatigue = LowResource({
        'table': 'fatigues',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId'
          }
        },
        'defaultEntries': fatigueDefaults
      });

      _.mixin(Fatigue, HtHelper);
      Fatigue.htInit(fatigueConfig);

      return Fatigue;
    }
  ]);
