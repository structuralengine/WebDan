'use strict';

/**
 * @ngdoc service
 * @name webdan.BendingMoment
 * @description
 * # BendingMoment
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BendingMoment', ['LowResource', 'bendingMomentConfig', 'bendingMomentDefaults', 'HtHelper',
    function (LowResource, bendingMomentConfig, bendingMomentDefaults, HtHelper) {

      let foreignKey = 'designPointId';

      let BendingMoment = LowResource({
        'table': 'bendingMoments',
        'foreignKeys': {
          'parents': {
            DesignPoint: foreignKey,
          },
        },
        'defaultEntries': bendingMomentDefaults,
      });

      _.mixin(BendingMoment, HtHelper);
      BendingMoment.htInit(bendingMomentConfig);

      HtHelper.enableEditableForeignValue({
        onResource: BendingMoment,
        parent: 'DesignPoint',
        targetProp: 'p_name',
        config: bendingMomentConfig,
        refreshingHotIds: 'shears',
      });

      return BendingMoment;
    }
  ]);
