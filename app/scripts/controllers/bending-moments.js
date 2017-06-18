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
        let number = $filter('number');
        ctrl.bendingMoments = _.groupBy(bendingMoments, function(bendingMoment) {
          let designPoint = DesignPoint.getAsc(bendingMoment.designPointId);
          return nubmer(designPoint.Member.g_no, 1);
        });

        let settings = BendingMoment.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
