'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', ['$lowArray', 'HtHelper', 'membersConfig',
    function($lowArray, HtHelper, membersConfig) {

      let Member = $lowArray({
        store: 'members',
        primaryKey: 'm_no',
        foreignKeys: {
          parent: {
            Group: 'g_no',
          },
          children: {
            MemberSection: 'm_no',
            DesignPoint: 'm_no',
          },
        },
      });

      function init() {
        Member.nestedHeaders = HtHelper.parseNestedHeaders(membersConfig);
        Member.columns = HtHelper.parseColumns(membersConfig);
        return Member;
      }

      return init();
    }
  ]);
