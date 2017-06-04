'use strict';

/**
 * @ngdoc service
 * @name webdan.Group
 * @description
 * # Group
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Group', ['$lowArray', 'HtHelper', 'groupsConfig',
    function ($lowArray, HtHelper, groupsConfig) {

        let Group = $lowArray({
          store: 'groups',
          primaryKey: 'g_no',
          foreignKeys: {
            children: {
              Member: 'member_id'
            },
          },
        });

        function init() {
          Group.nestedHeaders = HtHelper.parseNestedHeaders(groupsConfig);
          Group.columns = HtHelper.parseColumns(groupsConfig);
          return Group;
        }

        return init();
      }
    ]);
