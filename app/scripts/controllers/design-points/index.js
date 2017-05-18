'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsIndexCtrl
 * @description
 * # DesignPointsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsIndexCtrl', function ($scope, $log, $routeParams, DesignPoint, Group) {
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
  });
