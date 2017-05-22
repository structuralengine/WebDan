'use strict';

/**
 * @ngdoc service
 * @name webdan.BendingMoment
 * @description
 * # BendingMoment
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BendingMoment', ['webdanRef', '$fbResource', 'bendingMomentsConfig',
    function (webdanRef, $fbResource, bendingMomentsConfig) {

      let BendingMoment = $fbResource({
        ref: webdanRef.child('bending-moments'),
        foreignKeysIn: {
          parent: {
            children: {
              BendingMoment: 'bendingMoments'
            }
          },
          entry: {
            parent: {
              DesignPoint: 'designPoint'
            }
          }
        }
      });

      function init() {
        BendingMoment.nestedHeaders = [];
        createNestedHeaders(bendingMomentsConfig, BendingMoment.nestedHeaders);
        BendingMoment.columns = createColumns(bendingMomentsConfig);
      }

      function createNestedHeaders(config, nestedHeaders, depth) {
        nestedHeaders = nestedHeaders || [];
        depth = depth || 0;
        if (angular.isUndefined(nestedHeaders[depth])) {
          nestedHeaders.splice(depth, 0, []);
        }
        let nestedHeader = nestedHeaders[depth];
        let cellCount = 0;

        angular.forEach(config, function(config1, key1) {
          if (angular.isUndefined(config1.items)) {
            nestedHeader.push(key1);
            cellCount++;
          }
          else {
            let len = createNestedHeaders(config1.items, nestedHeaders, depth + 1);
            nestedHeader.push({
              label: key1,
              colspan: len
            });
            cellCount += len;
          }
        });

        return cellCount;
      }

      function createColumns(config, columns) {
        columns = columns || [];
        angular.forEach(config, function(config1, key1) {
          if (angular.isDefined(config1.column)) {
            columns.push(config1.column);
          }
          if (angular.isDefined(config1.items)) {
            createColumns(config1.items, columns);
          }
        });

        return columns;
      }

      init();

      return BendingMoment;
    }
  ]);