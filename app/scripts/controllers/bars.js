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
        ctrl.groups = Member.Group.query();

        let bars = Bar.query();
        let number = $filter('number');
        ctrl.bars = _.groupBy(bars, function(bar) {
          let designPoint = DesignPoint.getAsc(bar.designPointId);
          return number(designPoint.Member.g_no, 1);
        });

        ctrl.settings = Bar.settings;
        ctrl.settings.minSpareRows = 0;
      }

      init();
    }
  ]);
