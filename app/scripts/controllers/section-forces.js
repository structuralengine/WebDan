'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesCtrl
 * @description
 * # SectionForcesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesCtrl', ['$scope', '$filter', '$q', 'BendingMoment', 'Shear', 'DesignPoint', 'HtHelper',
    function ($scope, $filter, $q, BendingMoment, Shear, DesignPoint, HtHelper) {
      let ctrl = this;

      function init() {
        ctrl.settings = {
          bendingMoments: BendingMoment.settings,
          shears: Shear.settings,
        };
        angular.forEach(ctrl.settings, function(settings, hotId) {
          settings.enterMoves = HtHelper.enterMoves(hotId, 3);
        });

        // Bending Moments
        let bendingMoments = BendingMoment.query();
        if (bendingMoments.length > 0) {
          ctrl.bendingMoments = filter(bendingMoments);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return BendingMoment.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            bendingMoments = BendingMoment.query();
            ctrl.bendingMoments = filter(bendingMoments);
          });
        }

        // Shears
        let shears = Shear.query();
        if (shears.length > 0) {
          ctrl.shears = filter(shears);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return Shear.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            shears = Shear.query();
            ctrl.shears = filter(shears);
          });
        }

        function filter(entries) {
          return entries.filter(function(entry) {
            let designPoint = DesignPoint.getById(entry.designPointId);
            return designPoint.p_name;
          });
        }
      }

      init();
    }
  ]);
