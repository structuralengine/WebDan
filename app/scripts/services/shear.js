'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['LowResource', 'DesignPoint', 'shearConfig', 'HtHelper',
    function (LowResource, DesignPoint, shearConfig, HtHelper) {

      let Shear = LowResource({
        'store': 'shears',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(Shear, HtHelper);

      Shear.htInit(shearConfig);

      HtHelper.enableEditableForeignValue({
        onResource: Shear,
        parent: 'DesignPoint',
        targetProp: 'p_name',
        config: shearConfig,
        refreshingHotIds: 'bendingMoments',
      });

      return Shear;
    }
  ]);
