'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersIndexCtrl', ['$scope', '$log', 'Member',
    function($scope, $log, Member) {
      var ctrl = this;
      var origMembers;

      ctrl.members = [];

      Member.query().$loaded(function(members) {
        origMembers = members;
        ctrl.members = angular.copy(members);
      });

      ctrl.settings = {
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        colHeaders: [
          'グループ No.',
          '部材名'
        ],
        columns: [
          {data: 'g_no'},
          {data: 'g_name'}
        ],
        afterChange: function(changes, source) {
          (changes || []).forEach(function(change) {
            let [idx, prop, oldVal, newVal] = change;
            let member = ctrl.members[idx];
            if (member) {
              member.$dirty = true;
            }
          })
        }
      };

      ctrl.isDirty = function() {
        return ctrl.members.some(function(member) {
          return !!member.$dirty;
        })
      };

      ctrl.save = function() {
        ctrl.members.forEach(function(member) {
          if (!member.$dirty) {
            return;
          }

          try {
            if (Member.isEmpty(member)) {
              let idx = ctrl.members.indexOf(member);
              if (!member.$id) {
                removeMember(idx);
              } else {
                Member.remove(member).then(function(ref) {
                  removeMember(idx);
                });
              }
            } else {
              if (member.$id) {
                Member.save(member).then(function(ref) {
                  resetDirty(member);
                });
              } else {
                Member.add(member).then(function(ref) {
                  member.$id = ref.key;
                  resetDirty(member);
                });
              }
            }
          } catch (e) {
            $log.error(e);
          }
        })
      }

      function removeMember(idx) {
        ctrl.members.splice(idx, 1);
      }

      function resetDirty(member) {
        member.$dirty = false;
      }
    }
  ]);
