'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ShearsCtrl
 * @description
 * # ShearsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ShearsCtrl', ['$scope', '$filter', 'Shear', 'Group', 'DesignPoint',
    function ($scope, $filter, Shear, Group, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let shears = Shear.query();
        ctrl.shears = _.groupBy(shears, function(shear) {
          let designPoint = DesignPoint.getAsc(shear.designPointId);
          return designPoint.Member.g_no;
        });

        let settings = Shear.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
