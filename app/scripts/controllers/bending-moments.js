'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BendingMomentsCtrl
 * @description
 * # BendingMomentsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BendingMomentsCtrl', ['$scope', '$filter', 'BendingMoment', 'Group', 'DesignPoint',
    function ($scope, $filter, BendingMoment, Group, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let bendingMoments = BendingMoment.query();
        ctrl.bendingMoments = _.groupBy(bendingMoments, function(bendingMoment) {
          let designPoint = DesignPoint.getAsc(bendingMoment.designPointId);
          return designPoint.Member.g_no;
        });

        let settings = BendingMoment.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
