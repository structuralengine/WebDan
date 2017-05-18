'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar1
 * @description
 * # Bar1
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar1', function (webdanRef, $fbResource, bar1sConfig, HtHelper) {

    let Bar1 = $fbResource({
      ref: webdanRef.child('bars'),
      foreignKeysIn: {
        parent: {
          children: {
            Bar1: 'bars'
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
      Bar1.nestedHeaders = HtHelper.parseNestedHeaders(bar1sConfig, 2);
      Bar1.columns = HtHelper.parseColumns(bar1sConfig);
    }

    init();

    return Bar1;
  });
