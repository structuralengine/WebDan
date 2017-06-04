'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsIndexCtrl
 * @description
 * # BarsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsIndexCtrl', ['$scope', 'Bar', 'DesignPoint', 'Group', 'handsontableConfig',
    function ($scope, Bar, DesignPoint, Group, handsontableConfig) {
      let ctrl = this;

      function init() {
        let nestedHeaders = angular.copy(Bar.nestedHeaders);
        let columns = angular.copy(Bar.columns);

        ctrl.settings = handsontableConfig.create({
          nestedHeaders: nestedHeaders,
          columns: columns,
          resource: Bar,
        });

        let bars = Bar.query().filter(function(bar) {
          let designPoint = DesignPoint.getAsc(bar.designPoint_id);
          bar.g_no = designPoint.Member.g_no;
          return designPoint.p_name;
        });

        ctrl.groupedBars = _.groupBy(bars, function(bar) {
          return bar.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
