'use strict';

angular.module('webdan')
  .service('Group', ['$filter', 'groupDefaults',
    function ($filter, groupDefaults) {

      let groupNames = {};

      this.loadMembers = function(members) {
        groupNames = members.reduce(function(names, member) {
          let g_no = member.g_no;
          let g_name = member.g_name;
          if (g_no && g_name) {
            names[g_no] = g_name;
          }
          return names;
        }, {});
      };

      this.query = function () {
          let groups = [];
          angular.forEach(groupNames, function (g_name, g_no) {
              groups.push({
                  g_no: g_no,
                  g_name: g_name
              });
          });
          return groups;
      };

      this.update = function(member, coll) {
        let g_no = _.get(member, 'g_no');
        let g_name = _.get(member, 'g_name');

        if (g_no) {
          g_no = $filter('number')(g_no, 1);
          if (g_name) {
            updateOtherGroupNames(g_no, g_name, coll);
          }
          else if (!g_name) {
            g_name = getCurrentGroupName(g_no);
          }
        }
        else if (!g_no) {
          g_name = '';
        }
        _.set(member, 'g_name', g_name);
      };

      function updateOtherGroupNames(g_no, g_name, members) {
        members.forEach(function(member) {
          if (member.g_no === g_no) {
            member.g_name = g_name;
          }
        });
      }

      function getCurrentGroupName(g_no) {
        let g_name;
        if (angular.isUndefined(groupNames[g_no])) {
          if (angular.isUndefined(groupDefaults[g_no])) {
            throw 'services/Group: no group name with '+ g_no;
          }
          g_name = groupNames[g_no] = groupDefaults[g_no];
        }
        else {
          g_name = groupNames[g_no];
        }
        return g_name;
      }

    }
  ]);
