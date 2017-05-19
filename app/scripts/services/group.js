'use strict';

/**
 * @ngdoc service
 * @name webdan.Group
 * @description
 * # Group
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Group', ['webdanRef', '$fbResource', 'HtHelper', 'groupsConfig',
    function (webdanRef, $fbResource, HtHelper, groupsConfig) {

        let Group = $fbResource({
          ref: webdanRef.child('groups'),
          foreignKeysIn: {
            entry: {
              children: {
                Member: 'members'
              }
            },
            child: {
              parent: {
                Group: 'group'
              }
            }
          }
        });

        function init() {
          Group.nestedHeaders = HtHelper.parseNestedHeaders(groupsConfig);
          Group.columns = HtHelper.parseColumns(groupsConfig);
        }

        init();

        return Group;
      }  ]);
