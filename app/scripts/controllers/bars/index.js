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

      function renderMemberNo(instance, td, row, col, prop, value, cellProperties) {
        return td;
      }
      function renderPointName(instance, td, row, col, prop, value, cellProperties) {
        return td;
      }
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
        nestedHeaders[0].splice(0, 0,
          '部材番号',
          '算出点名',
          '断面力',
          'ハンチ高'
        );
        nestedHeaders[1].splice(0, 0,
          '',
          '',
          'B',
          '曲げ'
        );
        nestedHeaders[2].splice(0, 0,
          '',
          '',
          'H',
          'せん断'
        );

        let columns = angular.copy(Bar.columns);
        columns.splice(0, 0, {
          // DesignPoint.Member.m_no
          data: 'DesignPoint_id',
          type: 'numeric',
          renderer: renderMemberNo,
        }, {
          // DesignPoint.p_name
          data: 'DesignPoint_id',
          type: 'numeric',
          renderer: renderPointName,
        }, {
          // DesignPoint.section
          data: 'DesignPoint_id',
          type: 'numeric',
          renderer: renderSection,
        }, {
          // DesignPoint
          data: 'DesignPoint_id',
          type: 'numeric',
          renderer: renderHaunchHeight,
        });

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          nestedHeaders: nestedHeaders,
          columns: columns,
          afterChange: function(changes, source) {
            if (source !== 'loadData') {
              let get = this.getSourceDataAtRow;
              changes.forEach(function(change) {
                let bar = get(change[0]);
                Bar.save(bar);
              });
            }
          },
        };

        let bars = Bar.query();
        ctrl.groupedBars = _.groupBy(bars, function(bar) {
          let designPoint = DesignPoint.getAsc('id', bar.designPoint_id);
          return designPoint.Member.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
