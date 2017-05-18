'use strict';

/**
 * @ngdoc service
 * @name webdan.Fatigue1
 * @description
 * # Fatigue1
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Fatigue1', function (webdanRef, $fbResource, fatigue1sConfig, HtHelper) {

    let Fatigue1 = $fbResource({
      ref: webdanRef.child('fatigues'),
      foreignKeysIn: {
        parent: {
          children: {
            Fatigue1: 'fatigues'
          },
        },
        entry: {
          parent: {
            DesignPoint: 'designPoint'
          },
        },
      }
    });

    function init() {
      Fatigue1.nestedHeaders = HtHelper.parseNestedHeaders(fatigue1sConfig, 1);
      Fatigue1.columns = HtHelper.parseColumns(fatigue1sConfig);
    }

    init();

    return Fatigue1;
  });
