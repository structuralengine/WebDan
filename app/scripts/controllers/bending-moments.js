'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BendingMomentsCtrl
 * @description
 * # BendingMomentsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BendingMomentsCtrl', ['$scope', '$filter', '$location', 'BendingMoment', 'Group', 'DesignPoint',
    function ($scope, $filter, $location, BendingMoment, Group, DesignPoint) {
      let ctrl = this;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');
        ctrl.settings = BendingMoment.settings;

        let bendingMoments = BendingMoment.query();
        if (bendingMoments.length > 0) {
          groupBy(bendingMoments);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return BendingMoment.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            bendingMoments = BendingMoment.query();
            groupBy(bendingMoments);
          });
        }

        function groupBy(bendingMoments) {
          let number = $filter('number');
          ctrl.bendingMoments = _.groupBy(bendingMoments, function(bendingMoment) {
            let designPoint = DesignPoint.getAsc(bendingMoment.designPointId);
            return nubmer(designPoint.Member.g_no, 1);
          });
        }
      }

      init();
    }
  ]);
