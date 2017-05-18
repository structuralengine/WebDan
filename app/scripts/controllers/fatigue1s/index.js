'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:Fatigue1sIndexCtrl
 * @description
 * # Fatigue1sIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('Fatigue1sIndexCtrl', function ($scope, $log, $q, Fatigue1, Group, fatigue1sConfig) {
    let ctrl = this;

    function renderSection(instance, td, row, col, prop, value, cellProperties) {
      if (value) {
        let val;
        if (row % 2 == 0) {
          val = value.B || null;
        }
        else {
          val = value.H || null;
        }
        angular.element(td).html(val);
      }
      return td;
    }

    function init() {
      let nestedHeaders = Fatigue1.nestedHeaders.map(function(nestedHeader) {
        return nestedHeader.splice(2);
      });
      nestedHeaders = angular.copy(nestedHeaders).map(function(nestedHeader) {
        return nestedHeader.concat(nestedHeader);
      });
      nestedHeaders.splice(0, 0, [{
        label: '位置',
        colspan: 1,
      }, {
        label: '曲げ用',
        colspan: 8,
      }, {
        label: 'せん断用',
        colspan: 8,
      }]);
      nestedHeaders[0].splice(0, 0, '部材番号', '算出点名', '断面力');
      nestedHeaders[1].splice(0, 0, ''       , ''       , 'B'     , '');
      nestedHeaders[2].splice(0, 0, ''       , ''       , 'H'     , '');

      let columns = [];
      [0, 1].forEach(function(i) {
        let coll = angular.copy(Fatigue1.columns).splice(2);
        coll.forEach(function(column, j) {
          column.data = i +'.'+ column.data;
          column.allowEmpty = true;
          columns.push(column);
        });
      });
      let rebarSideColumn = angular.copy(Fatigue1.columns[0]);
      rebarSideColumn.data = '0.'+ rebarSideColumn.data;
      columns.splice(0, 0,
        {
          data: '0.DesignPoint.Member.m_no',
          type: 'numeric'
        }, {
          data: '0.DesignPoint.p_name',
        }, {
          data: '0.DesignPoint.section',
          type: 'numeric',
          renderer: renderSection
        },
        rebarSideColumn,
      );

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: nestedHeaders,
        columns: columns
      };

      Fatigue1.$queryAsc().then(function(fatigue1s) {
        let groupedFatigue1s = _.groupBy(fatigue1s, function(fatigue1) {
          return fatigue1.DesignPoint.Member.group;
        });

        angular.forEach(groupedFatigue1s, function(fatigue1sByGroup, groupKey) {
          let fatigue1sByRebarSide = _.groupBy(fatigue1sByGroup, function(fatigue1) {
            return fatigue1.rebar_side;
          });

          groupedFatigue1s[groupKey] = Object.values(fatigue1sByRebarSide).map(function(fatigue1sByPurpose) {
            return fatigue1sByPurpose;
          });
        });

        ctrl.groupedFatigue1s = groupedFatigue1s;
        ctrl.groups = Group.query();

        $log.debug('columns', ctrl.settings.columns);
        $log.debug('groupedFatigue1s', ctrl.groupedFatigue1s);
      });
    }

    init();
  });
