'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ShearsCtrl
 * @description
 * # ShearsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ShearsCtrl', ['$scope', '$filter', '$location', 'Shear', 'Group', 'DesignPoint',
    function ($scope, $filter, $location, Shear, Group, DesignPoint) {
      let ctrl = this;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');
        ctrl.settings = Shear.settings;

        let shears = Shear.query();
        if (shears.length > 0) {
          groupBy(shears);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return Shear.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            shears = Shear.query();
            groupBy(shears);
          });
        }

        function groupBy(shears) {
          let number = $filter('nubmer');
          ctrl.shears = _.groupBy(shears, function(shear) {
            let designPoint = DesignPoint.getAsc(shear.designPointId);
            return number(designPoint.Member.g_no, 1);
          });
        }
      }

      init();
    }
  ]);
