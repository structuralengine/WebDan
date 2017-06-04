'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$filter', 'Group', 'HtHelper', 'handsontableConfig',
    function ($scope, $filter, Group, HtHelper, handsontableConfig) {
      let ctrl = this;

      ctrl.settings = handsontableConfig.create({
        nestedHeaders: Group.nestedHeaders,
        columns: Group.columns,
<<<<<<< .mine
        contextMenu: {
          items: {
            'remove_row': {
              name: 'síœ',
            },
          },
        },
        afterChange: function(changes, source) {
          if (source !== 'loadData') {
            let hot = this;
            changes.forEach(function(change) {
              let group = hot.getSourceDataAtRow(change[0]);
              Group.save(group);
            })
          }
        },
        beforeRemoveRow: function(index, amount, logicalRows) {
          let get = this.getSourceDataAtRow;
          logicalRows.map(function(row) {
            let group = get(row);
            return group.id;
          })
          .forEach(function(id) {
            Group.remove(id);
          });
        },
      };
=======
        resource: Group,
      });

























>>>>>>> .theirs

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), function(group) {
          return group.g_no;
        });
      }

      init();
    }
  ]);
