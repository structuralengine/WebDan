'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndex2Ctrl', ['$scope', '$log', 'DesignPoint', 'Group',
    function ($scope, $log, DesignPoint, Group) {
      let ctrl = this;

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: DesignPoint.nestedHeaders,
        columns: DesignPoint.columns
      };

      function init() {
        DesignPoint.$queryAsc().then(function(designPoints) {
          ctrl.groupedDesignPoints = _.groupBy(designPoints, function(designPoint) {
            return designPoint.Member.group;
          })

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
