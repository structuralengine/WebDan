'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$log', 'Group', 'HtHelper',
    function ($scope, $log, Group, HtHelper) {
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
        afterRemoveRow: function(index, amount, logicalRows) {
          Group.remove();
        },
      };

      function init() {
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
