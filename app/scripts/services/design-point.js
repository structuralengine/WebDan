'use strict';

/**
 * @ngdoc service
 * @name webdan.DesignPoint
 * @description
 * # DesignPoint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('DesignPoint', ['$lowArray', '$injector', 'designPointsConfig', 'appConfig',
    function($lowArray, $injector, designPointsConfig, appConfig) {

      let DesignPoint = $lowArray({
        store: 'designPoints',
        foreignKeys: {
          parent: {
            Member: 'm_no',
          },
          children: {
            Bar: 'designPoint_id',
            Fatigue: 'designPoint_id',
            BendingMoment: 'designPoint_id',
            Shear: 'designPoint_id',
          },
        },
        afterAdd: addChildren,
      });

      function addChildren(id, childForeignKeys) {
        angular.forEach(childForeignKeys, function(foreignKey, alias) {
          let Child = $injector.get(alias);
          if (!Child) {
            throw 'no such child resource: '+ alias;
          }
          switch (alias) {
            case 'Bar':
            case 'Fatigue':
              let key = (alias == 'Bar')? 'bars': 'fatigues';
              let positions = appConfig.defaults[key].positions;
              angular.forEach(positions, function(label, position) {
                let child = {};
                child[foreignKey] = id;
                child.rebar_side = position;
                Child.add(child);
              });
              break;

            case 'BendingMoment':
              let bendingMoment = {};
              bendingMoment.designPoint_id = id;
              Child.add(bendingMoment);
              break;

            default:
              break;
          }
        });
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

      function init() {
        DesignPoint.nestedHeaders = createNestedHeaders();
        DesignPoint.columns = createColumns();
        return DesignPoint;
      }

      return init();
    }
  ]);
