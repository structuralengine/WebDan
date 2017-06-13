'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['LowResource', 'shearConfig', 'HtHelper',
    function (LowResource, shearConfig, HtHelper) {

      let Shear = LowResource({
        "store": 'shears',
        "foreignKeys": {
          "parents": {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(Shear, HtHelper);

      Shear.htInit(shearConfig);

      return Shear;
    }
  ]);
