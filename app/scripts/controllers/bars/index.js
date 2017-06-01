'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsIndexCtrl
 * @description
 * # BarsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsIndexCtrl', ['$scope', '$log', '$q', 'Bar', 'Group', 'barsConfig',
    function ($scope, $log, $q, Bar, Group, barsConfig) {
      let ctrl = this;

      function renderSection(instance, td, row, col, prop, value, cellProperties) {
        if (value) {
          let val = (row % 2 == 0)? (value.B || null) : (value.H || null);
          angular.element(td).html(val);
        }
        return td;
      }

      function renderHaunchHeight(instance, td, row, col, prop, value, cellProperties) {
        if (value) {
          let val = (row % 2 == 0)? value.dH_m : value.dH_s;
          angular.element(td).html(val);
        }
        return td;
      }

      function init() {
        let nestedHeaders = angular.copy(Bar.nestedHeaders);
        nestedHeaders[0].splice(0, 0, '部材番号', '算出点名', '断面力', 'ハンチ高');
        nestedHeaders[1].splice(0, 0, '', '', 'B', '曲げ');
        nestedHeaders[2].splice(0, 0, '', '', 'H', 'せん断');

        let columns = angular.copy(Bar.columns);
        columns.splice(0, 0, {
          data: 'DesignPoint.Member.m_no',
          type: 'numeric'
        }, {
          data: 'DesignPoint.p_name',
        }, {
          data: 'DesignPoint.section',
          type: 'numeric',
          renderer: renderSection,
        }, {
          data: 'DesignPoint',
          type: 'numeric',
          renderer: renderHaunchHeight,
        })

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          nestedHeaders: nestedHeaders,
          columns: columns
        };

        let bars = Bar.$query();
        ctrl.groupedBars = _.groupBy(bars, function(bar) {
          return bar.DesignPoint.Member.group_id;
        });
      }

      init();
    }
  ]);
