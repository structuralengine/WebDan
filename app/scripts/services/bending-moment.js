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

      let BendingMoment = LowResource({
        "store": 'bendingMoments',
        "foreignKeys": {
          "parents": {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(BendingMoment, HtHelper);

      BendingMoment.htInit(bendingMomentConfig);

      return BendingMoment;
    }
  ]);
