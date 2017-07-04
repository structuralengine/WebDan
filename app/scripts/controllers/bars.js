'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsCtrl
 * @description
 * # BarsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsCtrl', ['$scope', '$filter', '$q', '$location', 'Bar', 'DesignPoint', 'Member', 'HtHelper', 'htNestedHeaders', 'barsNestedHeadersConfig',
    function ($scope, $filter, $q, $location, Bar, DesignPoint, Member, HtHelper, htNestedHeaders, barsNestedHeadersConfig) {
      let ctrl = this;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.groups = Member.Group.query();

        let bars = Bar.query();
        if (bars.length > 0) {
          groupBy(bars);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return Bar.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            bars = Bar.query();
            groupBy(bars);
          });
        }

        function groupBy(bars) {
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
            settings.afterRender = function() {
              htNestedHeaders.mergeCells(this, barsNestedHeadersConfig);
            };
          });
        }
      }

      init();
    }
  ]);
