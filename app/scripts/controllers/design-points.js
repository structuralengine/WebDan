'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsCtrl
 * @description
 * # DesignPointsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsCtrl', ['$scope', '$filter', '$location', '$log', 'DesignPoint', 'Group', 'Member',
    function ($scope, $filter, $location, $log, DesignPoint, Group, Member) {
      let ctrl = this;

      function init() {
        let groups = Group.query();
        if (groups.length == 0) {
          $scope.$emit('DesignPoints', 'no group');
          $log.error('no group');
        }
        else {
          ctrl.groups = $filter('orderBy')(groups, 'g_no');

          let designPoints = DesignPoint.query();
          ctrl.designPoints = _.groupBy(designPoints, function(designPoint) {
            let member = Member.get(designPoint.m_no);
            return member.g_no;
          });

          let settings = DesignPoint.settings;
          settings.minSpareRows = 0;
          ctrl.settings = settings;
        }
      }

      init();
    }
  ]);
