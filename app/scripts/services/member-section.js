'use strict';

/**
 * @ngdoc service
 * @name webdan.MemberSection
 * @description
 * # MemberSection
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MemberSection', function (webdanRef, $fbResource, memberSectionsConfig) {

    let params = {
      ref: webdanRef.child('member-sections'),
      foreignKeysIn: {
        parent: {
          children: {
            MemberSection: 'memberSections'
          }
        },
        entry: {
          parent: {
            Member: 'member'
          }
        }
      }
    };
    let MemberSection = $fbResource(params);


    function init() {
      createNestedHeaders(memberSectionsConfig);
      createColumns(memberSectionsConfig);
    }

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

    init();

    return MemberSection;
  });
