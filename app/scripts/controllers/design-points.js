'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsCtrl
 * @description
 * # DesignPointsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsCtrl', ['$scope', '$filter', 'DesignPoint', 'Group', 'Member',
    function ($scope, $filter, DesignPoint, Group, Member) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let designPoints = DesignPoint.query();
        ctrl.designPoints = _.groupBy(designPoints, function(designPoint) {
          let member = Member.get(designPoint.m_no);
          return member.g_no;
        });

        let settings = DesignPoint.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
