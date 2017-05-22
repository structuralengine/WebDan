'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndex2Ctrl', ['$scope', '$log', 'DesignPoint', 'Group',
    function ($scope, $log, DesignPoint, Group) {
      let ctrl = this;

      function init() {
        let nestedHeaders = angular.copy(DesignPoint.nestedHeaders);
        nestedHeaders[0].unshift('部材番号');
        nestedHeaders[1].unshift('');

        let columns = angular.copy(DesignPoint.columns);
        columns.unshift({
          data: 'Member.m_no',
          type: 'numeric',
        });

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          nestedHeaders: nestedHeaders,
          columns: columns,
        };

        DesignPoint.$queryAsc().then(function(designPoints) {
          ctrl.groupedDesignPoints = _.groupBy(designPoints, function(designPoint) {
            return designPoint.Member.group;
          })

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
