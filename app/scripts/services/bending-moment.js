'use strict';

/**
 * @ngdoc service
 * @name webdan.BendingMoment
 * @description
 * # BendingMoment
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BendingMoment', ['LowResource', 'bendingMomentConfig', 'HtHelper',
    function (LowResource, bendingMomentConfig, HtHelper) {

      let foreignKey = 'designPointId';

      let BendingMoment = LowResource({
        "store": 'bendingMoments',
        "foreignKeys": {
          "parents": {
            DesignPoint: foreignKey,
          },
        },
      });

      _.mixin(BendingMoment, HtHelper);

      BendingMoment.htInit(bendingMomentConfig);

      BendingMoment.settings.afterBeginEditing = HtHelper.getAfterBeginEditingForForeignKeyEditor('DesignPoint', 'p_name', bendingMomentConfig);
      BendingMoment.settings.beforeChange = HtHelper.getBeforeChangeForForeignKeyEditor('DesignPoint', 'p_name', foreignKey, 'shears');

      return BendingMoment;
    }
  ]);
