'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndexCtrl', ['$scope', '$log', 'DesignPoint', 'Member', 'Group',
    function ($scope, $log, DesignPoint, Member, Group) {
      let ctrl = this;

      function init() {
        let nestedHeaders = angular.copy(DesignPoint.nestedHeaders);
        nestedHeaders[0].unshift('部材番号');
        nestedHeaders[1].unshift('');

        let columns = angular.copy(DesignPoint.columns);
        columns.unshift({
          data: 'm_no',
          type: 'numeric',
        });

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          minSpareRows: 1,
          nestedHeaders: nestedHeaders,
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
                let designPoint = hot.getSourceDataAtRow(change[0]);
                DesignPoint.save(designPoint);
              })
            }
          },
          afterRemoveRow: function(index, amount, logicalRows) {
            DesignPoint.remove();
          },
        };

        let designPoints = DesignPoint.query();
        ctrl.groupedDesignPoints = _.groupBy(designPoints, function(designPoint) {
          let member = Member.getBy('m_no', designPoint.m_no);
          return member.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
