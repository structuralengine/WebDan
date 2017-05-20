'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndex1Ctrl', ['$scope', '$log', 'DesignPoint', 'Group',
    function ($scope, $log, DesignPoint, Group) {
      let ctrl = this;

      function init() {
        let nestedHeaders = [[
          '部材番号',
          '部材名',
          '算出点名',
        ]];

        let columns = [
          {
            data: 'Member.m_no',
            type: 'numeric',
          },{
            data: 'Member.Group.g_name',
          },
          DesignPoint.columns[2],
        ];

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
