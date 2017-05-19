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
        let nestedHeaders = angular.copy(Fatigue.nestedHeaders);
        nestedHeaders[0].splice(0, 0, '部材番号', '算出点名', '断面力');
        nestedHeaders[1].splice(0, 0, '', '', 'B');
        nestedHeaders[2].splice(0, 0, '', '', 'H');

        let columns = angular.copy(Fatigue.columns);
        columns.splice(0, 0,
          {
            data: 'DesignPoint.Member.m_no',
            type: 'numeric'
          }, {
            data: 'DesignPoint.p_name',
          }, {
            data: 'DesignPoint.section',
            type: 'numeric',
            renderer: renderSection
          }
        );

        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          nestedHeaders: nestedHeaders,
          columns: columns
        };

        Fatigue.$queryAsc().then(function(fatigues) {
          ctrl.groupedFatigues = _.groupBy(fatigues, function(fatigue) {
            return fatigue.DesignPoint.Member.group;
          });
          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
