'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['LowResource', 'DesignPoint', 'shearConfig', 'shearDefaults', 'HtHelper',
    function (LowResource, DesignPoint, shearConfig, shearDefaults, HtHelper) {

      let Shear = LowResource({
        'table': 'shears',
        'foreignKeys': {
          'parents': {
            DesignPoint: 'designPointId',
          },
        },
        'defaultEntries': shearDefaults,
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
