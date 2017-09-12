'use strict';

angular.module('webdan')
  .factory('Bar', ['LowResource', 'barConfig', 'barDefaults', 'HtHelper',
    function (LowResource, barConfig, barDefaults, HtHelper) {

      let Bar = LowResource({
        'table': 'bars',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId'
          }
        },
        'defaultEntries': barDefaults
      });

      _.mixin(Bar, HtHelper);
      Bar.htInit(barConfig);

      return Bar;
    }
  ]);
