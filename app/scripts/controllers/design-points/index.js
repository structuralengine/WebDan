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
        let columns = angular.copy(DesignPoint.columns);

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
              let get = this.getSourceDataAtRow;
              changes.forEach(function(change) {
                let designPoint = get(change[0]);
                DesignPoint.save(designPoint);
              });
            }
          },
          beforeRemoveRow: function(index, amount, logicalRows) {
            let get = this.getSourceDataAtRow;
            logicalRows.map(function(row) {
              let designPoint = get(row);
              return designPoint.id;
            })
            .forEach(function(id) {
              DesignPoint.remove(id);
            });
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
