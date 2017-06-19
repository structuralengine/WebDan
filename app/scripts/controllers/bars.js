'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsCtrl
 * @description
 * # BarsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsCtrl', ['$scope', '$filter', 'Bar', 'DesignPoint', 'Member', 'HtHelper',
    function ($scope, $filter, Bar, DesignPoint, Member, HtHelper) {
      let ctrl = this;

      function init() {
        ctrl.groups = Member.Group.query();

        let bars = Bar.query();
        let number = $filter('number');
        ctrl.bars = _.groupBy(bars, function(bar) {
          let designPoint = DesignPoint.getAsc(bar.designPointId);
          return number(designPoint.Member.g_no, 1);
        });

        ctrl.settings = {};
        let mergeConfig = [
          {prop: 'designPointId', col: 0},
          {prop: 'designPointId', col: 1},
        ];
        angular.forEach(ctrl.bars, function(bars, g_no) {
          let settings = ctrl.settings[g_no] = angular.copy(Bar.settings);
          settings.mergeCells = HtHelper.mergeCells(bars, mergeConfig);
        });
      }

      init();
    }
  ]);
