'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsCtrl
 * @description
 * # BarsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsCtrl', ['$scope', '$filter', 'Bar', 'Group', 'DesignPoint', 'MemberSection',
    function ($scope, $filter, Bar, Group, DesignPoint, MemberSection) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let bars = Bar.query();
        let sections = {};
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
