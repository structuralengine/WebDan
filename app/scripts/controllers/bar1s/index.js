'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:Bar1sIndexCtrl
 * @description
 * # Bar1sIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('Bar1sIndexCtrl', function ($scope, $log, $q, Bar1, Group, bar1sConfig) {
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
      let nestedHeaders = angular.copy(Bar1.nestedHeaders);
      nestedHeaders[0].splice(0, 0, '部材番号', '算出点名', '断面力', 'ハンチ高');
      nestedHeaders[1].splice(0, 0, '', '', 'B', '曲げ');
      nestedHeaders[2].splice(0, 0, '', '', 'H', 'せん断');

      let columns = angular.copy(Bar1.columns);
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

      Bar1.$queryAsc().then(function(bar1s) {
        let p1 = bar1s.map(function(bar1) {
          return Bar1.$getDesc(bar1).then(function(bar1) {
            return $q.resolve(bar1);
          })
        })

        $q.all(p1).then(function(bar1s) {
          ctrl.groupedBar1s = _.groupBy(bar1s, function(bar1) {
            return bar1.DesignPoint.Member.group;
          })

          ctrl.groups = Group.query();
        })
      });
    }

    init();
  });
