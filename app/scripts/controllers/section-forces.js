'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesCtrl
 * @description
 * # SectionForcesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesCtrl', ['$scope', '$filter', 'BendingMoment', 'Shear', 'DesignPoint', 'hotRegisterer',
    function ($scope, $filter, BendingMoment, Shear, DesignPoint, hotRegisterer) {
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
        angular.forEach(ctrl.settings, function(settings, key) {
          let hot, lastColIdx, lastRowIdx;
          settings.enterMoves = function() {
            hot = hot || hotRegisterer.getInstance(key);
            lastColIdx = lastColIdx || settings.columns.length - 1;
            lastRowIdx = lastRowIdx || hot.getSourceData().length - 1;
            let [startRow, startCol, endRow, endCol] = hot.getSelected();

            let row, col;
            if (startCol == lastColIdx) {
              if (startRow == lastRowIdx) {
                row = -lastRowIdx;
              }
              else {
                row = 1;
              }
              col = -(lastColIdx - 3);
            }
            else {
              row = 0;
              col = 1;
            }
            return {
              row: row,
              col: col,
            };
          };
        });
      }

      init();
    }
  ]);
