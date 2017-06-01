'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$filter', '$log', 'Group', 'HtHelper',
    function ($scope, $filter, $log, Group, HtHelper) {
      let ctrl = this;

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        minSpareRows: 1,
        nestedHeaders: Group.nestedHeaders,
        columns: Group.columns,
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

      function init() {
        let groups = Group.query();
        ctrl.groups = $filter('orderBy')(groups, function(group) {
          return group.g_no;
        });
      }

      init();
    }
  ]);
