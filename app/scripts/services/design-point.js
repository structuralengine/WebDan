'use strict';

/**
 * @ngdoc service
 * @name webdan.DesignPoint
 * @description
 * # DesignPoint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('DesignPoint', ['$lowArray', 'designPointsConfig',
    function($lowArray, designPointsConfig) {

      let DesignPoint = $lowArray({
        store: 'designPoints',
        foreignKeys: {
          parent: {
            Member: 'member_id',
          },
          children: {
            Bar: 'bar_id',
            Fatigue: 'fatigue_id',
            BendingMoment: 'bendingMoment_id',
            Shear: 'shear_id',
          },
        }
      });

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

      function init() {
        DesignPoint.nestedHeaders = createNestedHeaders();
        DesignPoint.columns = createColumns();
        return DesignPoint;
      }

      return init();
    }
  ]);
