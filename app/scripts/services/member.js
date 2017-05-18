'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', function (webdanRef, $fbResource, HtHelper, membersConfig) {

    let params = {
      ref: webdanRef.child('members'),
      foreignKeysIn: {
        parent: {
          children: {
            Member: 'members'
          },
        },
        entry: {
          parent: {
            Group: 'group'
          },
          children: {
            MemberSection: 'memberSections',
            DesignPoint: 'designPoints',
            SectionForce: 'sectionForces'
          }
        },
        child: {
          parent: {
            Member: 'member'
          }
        }
      }
    };
    let Member = $fbResource(params);

    function init() {
      Member.nestedHeaders = HtHelper.parseNestedHeaders(membersConfig);
      Member.columns = HtHelper.parseColumns(membersConfig);
    }

    init();

    return Member;
  });
