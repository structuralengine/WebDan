'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesIndexCtrl
 * @description
 * # FatiguesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesIndexCtrl', ['$scope', '$log', '$q', 'Fatigue', 'Group', 'fatiguesConfig',
    function ($scope, $log, $q, Fatigue, Group, fatiguesConfig) {
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
        let nestedHeaders = Fatigue.nestedHeaders.map(function(nestedHeader) {
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
          let coll = angular.copy(Fatigue.columns).splice(2);
          coll.forEach(function(column, j) {
            column.data = i +'.'+ column.data;
            column.allowEmpty = true;
            columns.push(column);
          });
        });
        let rebarSideColumn = angular.copy(Fatigue.columns[0]);
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

        Fatigue.$queryAsc().then(function(fatigues) {
          let groupedFatigues = _.groupBy(fatigues, function(fatigue) {
            return fatigue.DesignPoint.Member.group;
          });

          angular.forEach(groupedFatigues, function(fatiguesByGroup, groupKey) {
            let fatiguesByRebarSide = _.groupBy(fatiguesByGroup, function(fatigue) {
              return fatigue.rebar_side;
            });

            groupedFatigues[groupKey] = Object.values(fatiguesByRebarSide).map(function(fatiguesByPurpose) {
              return fatiguesByPurpose;
            });
          });

          ctrl.groupedFatigues = groupedFatigues;
          ctrl.groups = Group.query();

          $log.debug('columns', ctrl.settings.columns);
          $log.debug('groupedFatigues', ctrl.groupedFatigues);
        });
      }

      init();
    }
  ]);
