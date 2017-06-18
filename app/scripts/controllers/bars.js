'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsCtrl
 * @description
 * # BarsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsCtrl', ['$scope', '$filter', 'Bar', 'DesignPoint', 'Member',
    function ($scope, $filter, Bar, DesignPoint, Member) {
      let ctrl = this;

      function init() {
        let groups = Member.Group.query();
        ctrl.groups = $filter('orderBy')(groups, 'g_no');

        let bars = Bar.query();
        ctrl.bars = _.groupBy(bars, function(bar) {
          let designPoint = DesignPoint.getAsc(bar.designPointId);
          return designPoint.Member.g_no;
        });

        ctrl.settings = Bar.settings;
        ctrl.settings.minSpareRows = 0;
      }

      init();
    }
  ]);
