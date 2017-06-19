'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesCtrl
 * @description
 * # SectionForcesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesCtrl', ['$scope', '$filter', 'BendingMoment', 'Shear', 'DesignPoint', 'HtHelper',
    function ($scope, $filter, BendingMoment, Shear, DesignPoint, HtHelper) {
      let ctrl = this;

      function init() {
        let bendingMoments = BendingMoment.query();
        ctrl.bendingMoments = bendingMoments.filter(function(bendingMoment) {
          let designPoint = DesignPoint.get(bendingMoment.designPointId);
          return designPoint.p_name;
        });

        let shears = Shear.query();
        ctrl.shears = shears.filter(function(shear) {
          let designPoint = DesignPoint.get(shear.designPointId);
          return designPoint.p_name;
        });

        ctrl.settings = {
          bendingMoments: BendingMoment.settings,
          shears: Shear.settings,
        };

        let props = [{
          prop: 'designPointId',
          col: 1,
        }];
        angular.forEach(ctrl.settings, function(settings, key) {
          let coll = ctrl[key];
          settings.mergeCells = HtHelper.mergeCells(coll, props);
        });
      }

      init();
    }
  ]);
