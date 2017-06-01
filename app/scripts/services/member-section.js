'use strict';

/**
 * @ngdoc service
 * @name webdan.MemberSection
 * @description
 * # MemberSection
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MemberSection', ['$lowArray', 'memberSectionsConfig',
    function($lowArray, memberSectionsConfig) {

      let MemberSection = $lowArray({
        store: 'memberSections',
        foreignKeys: {
          parent: {
            Member: 'member_id',
          },
        },
      });

      function createColumns(config, columns) {
        if (angular.isUndefined(columns)) {
          columns = MemberSection.columns = [];
        }
        angular.forEach(config, function(conf, ja) {
          if (angular.isDefined(conf.items)) {
            createColumns(conf.items, columns);
          }
          else {
            columns.push(conf.column);
          }
        })
        return columns;
      }

      function createNestedHeaders(config) {
        let nestedHeaders = MemberSection.nestedHeaders = [];
        let nestedHeader = [];
        angular.forEach(config, function(conf, ja) {
          if (angular.isUndefined(conf.items)) {
            nestedHeader.push(ja);
          }
          else {
            nestedHeader.push({
              label: ja,
              colspan: Object.keys(conf.items).length
            })
          }
        })
        nestedHeaders.push(nestedHeader);
        nestedHeader = [];
        angular.forEach(config, function(conf, ja) {
          if (angular.isUndefined(conf.items)) {
            nestedHeader.push('');
          }
          else {
            angular.forEach(conf.items, function(cfg, ja) {
              nestedHeader.push(ja);
            })
          }
        })
        nestedHeaders.push(nestedHeader);
      }

      function init() {
        createNestedHeaders(memberSectionsConfig);
        createColumns(memberSectionsConfig);
        return MemberSection;
      }

      return init();
    }
  ]);
