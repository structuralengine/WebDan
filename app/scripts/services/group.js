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
              "Member": 'member_id',
              "SafetyFactor": 'g_no',
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
