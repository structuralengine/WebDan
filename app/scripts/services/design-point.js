'use strict';

/**
 * @ngdoc service
 * @name webdan.DesignPoint
 * @description
 * # DesignPoint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('DesignPoint', ['$injector', 'LowResource', 'appConfig', 'designPointConfig', 'barConfig', 'fatigueConfig', 'designPointDefaults', 'HtHelper',
    function ($injector, LowResource, appConfig, designPointConfig, barConfig, fatigueConfig, designPointDefaults, HtHelper) {

      let foreignKey = 'designPointId';

      let DesignPoint = LowResource({
        'table': 'designPoints',
        'foreignKeys': {
          'parents': {
            Member: 'm_no',
          },
          'children': {
            Bar: foreignKey,
            Fatigue: foreignKey,
            BendingMoment: foreignKey,
            Shear: foreignKey,
          },
        },
        'defaultEntries': designPointDefaults,
      });

      _.mixin(DesignPoint, HtHelper);
      DesignPoint.htInit(designPointConfig);

      return DesignPoint;
    }
  ]);
