'use strict';

/**
 * @ngdoc service
 * @name webdan.Group
 * @description
 * # Group
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Group', ['$lowArray', '$injector', 'HtHelper', 'groupsConfig', 'appConfig',
    function ($lowArray, $injector, HtHelper, groupsConfig, appConfig) {

        let Group = $lowArray({
          store: 'groups',
          primaryKey: 'g_no',
          foreignKeys: {
            children: {
              "Member": 'g_no',
              "SafetyFactor": 'g_no',
              "MaterialStrength": "g_no",
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
              case 'SafetyFactor':
                let keys = appConfig.defaults.safetyFactors.keys;
                keys.forEach(function(key) {
                  let child = {};
                  child[foreignKey] = id;
                  child.name = key;
                  Child.add(child);
                });
                break;

              case 'MaterialStrength':
                let bars = appConfig.defaults.materialStrengths.bars;
                let ranges = appConfig.defaults.materialStrengths.ranges;
                angular.forEach(bars, function(bar, barKey) {
                  angular.forEach(ranges, function(range, rangeKey) {
                    let child = {};
                    child[foreignKey] = id;
                    child.bar = barKey;
                    child.range = rangeKey;
                    Child.add(child);
                  })
                })
                break;

              default:
                break;
            }
          });
        }

        function init() {
          Group.nestedHeaders = HtHelper.parseNestedHeaders(groupsConfig);
          Group.columns = HtHelper.parseColumns(groupsConfig);
          return Group;
        }

        return init();
      }
    ]);
