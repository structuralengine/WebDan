'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersIndexCtrl', ['$scope', '$log', '$filter', 'Member', 'Group',
    function($scope, $log, $filter, Member, Group) {
      let ctrl = this;

      function renderGroup(hot, td, row, col, prop, g_no, cellProperties) {
        let label = '';
        if (g_no) {
          let group = Group.getBy('g_no', g_no);
          if (group) {
            label = group.g_name;
          }
        }
        angular.element(td).html(label);
        return td;
      }

      function init() {
        let columns = angular.copy(Member.columns);
        columns[0].renderer = renderGroup;

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          minSpareRows: 1,
          nestedHeaders: Member.nestedHeaders,
          columns: columns,
          contextMenu: {
            items: {
              'remove_row': {
                name: '行削除',
              },
            },
          },
          afterChange: function(changes, source) {
            if (source !== 'loadData') {
              let hot = this;
              changes.forEach(function(change) {
                let member = hot.getSourceDataAtRow(change[0]);
                Member.save(member);
              })
            }
          },
          afterRemoveRow: function(index, amount, logicalRows) {
            Member.remove();
          },
        };

        ctrl.members = Member.query()
          .filter(function(m) {
            return m.id;
          })
          .sort(function(m1, m2) {
            return m1.g_no - m2.g_no;
          });
      }

      init();
    }
  ]);
