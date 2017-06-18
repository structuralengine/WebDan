'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesCtrl
 * @description
 * # SectionForcesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesCtrl', ['$scope', '$filter', 'BendingMoment', 'Shear', 'DesignPoint',
    function ($scope, $filter, BendingMoment, Shear, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.bendingMoments = BendingMoment.query().filter(function(bendingMoment) {
          let designPoint = DesignPoint.get(bendingMoment.designPointId);
          return designPoint.p_name;
        });

        ctrl.shears = Shear.query().filter(function(shear) {
          let designPoint = DesignPoint.get(shear.designPointId);
          return designPoint.p_name;
        });

        ctrl.settings = {
          bendingMoments: BendingMoment.settings,
          shears: Shear.settings,
        };
      }

      init();
    }
  ]);
