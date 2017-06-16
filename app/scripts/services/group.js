'use strict';

/**
 * @ngdoc service
 * @name webdan.Group
 * @description
 * # Group
 * Service in the webdan.
 */
angular.module('webdan')
  .service('Group', ['$filter', 'groupDefaults',
    function ($filter, groupDefaults) {

      let currentNames = {};

      this.update = function(member, coll) {
        let g_no = _.get(member, 'g_no');
        let g_name = _.get(member, 'g_name');

        if (g_no) {
          g_no = $filter('number')(g_no, 1);
          if (g_name) {
            updateOtherGNames(g_no, g_name, coll);
          }
          else if (!g_name) {
            g_name = getCurrentGName(g_no);
          }
        }
        else if (!g_no) {
          g_name = '';
        }
        _.set(member, 'g_name', g_name);
      };

      function updateOtherGNames(g_no, g_name, members) {
        members.forEach(function(member) {
          if (member.g_no == g_no) {
            member.g_name = g_name;
          }
        });
      }

      function getCurrentGName(g_no) {
        let g_name;
        if (angular.isUndefined(currentNames[g_no])) {
          if (angular.isUndefined(groupDefaults[g_no])) {
            throw 'services/Group: no group name with '+ g_no;
          }
          g_name = currentNames[g_no] = groupDefaults[g_no];
        }
        else {
          g_name = currentNames[g_no];
        }
        return g_name;
      }
    }
  ]);
