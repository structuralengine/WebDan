'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndexCtrl', ['$scope', '$log', 'DesignPoint', 'Member', 'Group', 'handsontableConfig',
    function ($scope, $log, DesignPoint, Member, Group, handsontableConfig) {
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

        ctrl.settings = handsontableConfig.create({
          resource: DesignPoint,
          nestedHeaders: nestedHeaders,
          columns: columns,
        });

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
