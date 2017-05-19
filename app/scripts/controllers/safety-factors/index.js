'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsIndexCtrl
 * @description
 * # SafetyFactorsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsIndexCtrl', ['$scope', '$log', '$filter', 'SafetyFactor', 'Group', 'appConfig',
    function($scope, $log, $filter, SafetyFactor, Group, appConfig) {
      let ctrl = this;
      let considerRebars = {};

      function renderConsiderRebar(instance, td, row, col, prop, value, cellProperties) {
        if (value) {
          let considerRebar = considerRebars[value] || {};
          let name = considerRebar.name;
          angular.element(td).html(name);
        }
        return td;
      }

      function init() {
        let columns = angular.copy(SafetyFactor.columns);
        let considerRebarColumn = columns[columns.length - 1];
        considerRebarColumn.renderer = renderConsiderRebar;

        appConfig.defaults.safetyFactors.considerRebars.forEach(function(considerRebar) {
          considerRebars[considerRebar.value] = considerRebar;
        });

        ctrl.settings = {
          rowHeaders: false,
          colHeaders: true,
          nestedHeaders: SafetyFactor.nestedHeaders,
          columns: columns,
        };

        SafetyFactor.$query().then(function(safetyFactors) {
          ctrl.groupedSafetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
            return safetyFactor.group;
          });

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
