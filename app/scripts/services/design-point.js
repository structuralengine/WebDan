'use strict';

/**
 * @ngdoc service
 * @name webdan.DesignPoint
 * @description
 * # DesignPoint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('DesignPoint', ['webdanRef', '$fbResource', 'designPointsConfig',
    function(webdanRef, $fbResource, designPointsConfig) {

      let DesignPoint = $fbResource({
        ref: webdanRef.child('designPoints'),
        foreignKeysIn: {
          parent: {
            children: {
              DesignPoint: 'designPoints'
            },
          },
          entry: {
            parent: {
              Member: 'member'
            },
            children: {
              Bar: 'bars',
              Fatigue: 'fatigues',
              BendingMoment: 'bendingMoments',
              Shear: 'shears',
            }
          },
          child: {
            parent: {
              DesignPoint: 'designPoint'
            }
          }
        }
      });

      function init() {
        DesignPoint.nestedHeaders = createNestedHeaders();
        DesignPoint.columns = createColumns();
      }

      function createNestedHeaders() {
        let nestedHeaders = [];
        let nestedHeader;
        for (let i = 0; i < 2; i++) {
          nestedHeader = [];
          if (i == 0) {
            angular.forEach(designPointsConfig, function(config, ja) {
              if (angular.isUndefined(config.items)) {
                nestedHeader.push(ja);
              }
              else {
                nestedHeader.push({
                  label: ja,
                  colspan: Object.keys(config.items).length
                })
              }
            })
          }
          else {
            angular.forEach(designPointsConfig, function(config, ja) {
              if (angular.isUndefined(config.items)) {
                nestedHeader.push('');
              }
              else {
                angular.forEach(config.items, function(conf, ja) {
                  nestedHeader.push(ja)
                })
              }
            })
          }
          nestedHeaders.push(nestedHeader);
        }
        return nestedHeaders;
      }

      function createColumns() {
        let columns = [];
        angular.forEach(designPointsConfig, function(config, ja) {
          if (angular.isUndefined(config.items)) {
            columns.push(config.column);
          }
          else {
            angular.forEach(config.items, function(conf, ja) {
              columns.push(conf.column);
            })
          }
        });
        return columns;
      }

      init();

      return DesignPoint;
    }
  ]);
