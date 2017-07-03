'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsCtrl
 * @description
 * # DesignPointsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsCtrl', ['$scope', '$filter', '$q', '$location', '$log', 'DesignPoint', 'Member', 'designPointNameDefaults',
    function ($scope, $filter, $q, $location, $log, DesignPoint, Member, designPointNameDefaults) {
      let ctrl = this;

      ctrl.designPointNames = designPointNameDefaults;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        let groups = Member.Group.query();
        if (groups.length == 0) {
          $scope.$emit('DesignPoints', 'no group');
          $log.error('no group');
        }
        else {
          ctrl.groups = groups;
          ctrl.settings = DesignPoint.settings;

          let designPoints = DesignPoint.query();
          if (designPoints.length == 0) {
            let p1 = Member.query().forEach(function(member) {
              return DesignPoint.createDefaultEntries('m_no', member.m_no);
            });

            $q.all(p1).then(function() {
              designPoints = DesignPoint.query();
              groupBy(designPoints);
            });
          }
          else {
            groupBy(designPoints);
          }
        }

        function groupBy(designPoints) {
          let number = $filter('number');
          ctrl.designPoints = _.groupBy(designPoints, function(designPoint) {
            let member = Member.getById(designPoint.m_no);
            return number(member.g_no, 1);
          });
        }
      }

      init();
    }
  ]);
