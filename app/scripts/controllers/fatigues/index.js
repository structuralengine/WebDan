'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesIndexCtrl
 * @description
 * # FatiguesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesIndexCtrl', ['$scope', 'Fatigue', 'DesignPoint', 'Group', 'handsontableConfig',
    function ($scope, Fatigue, DesignPoint, Group, handsontableConfig) {
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
        let columns = angular.copy(Fatigue.columns);

        ctrl.settings = handsontableConfig.create({
          nestedHeaders: nestedHeaders,
          columns: columns,
          resource: Fatigue,
        });

        let fatigues = Fatigue.query().filter(function(fatigue) {
          let designPoint = DesignPoint.getAsc(fatigue.designPoint_id);
          fatigue.g_no = designPoint.Member.g_no;
          return designPoint.p_name;
        });

        ctrl.groupedFatigues = _.groupBy(fatigues, function(fatigue) {
          return fatigue.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
