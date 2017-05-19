'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthsIndexCtrl
 * @description
 * # MaterialStrengthsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthsIndexCtrl', ['$scope', '$log', '$filter', 'MaterialStrength', 'Group', 'appConfig',
    function($scope, $log, $filter, MaterialStrength, Group, appConfig) {
      let ctrl = this;
      let rangesWithKey = {};

      function renderRange(instance, td, row, col, prop, value, cellProperties) {
        if (value) {
          let range = rangesWithKey[value];
          let name = range.name || '';
          angular.element(td).html(name);
        }
        return td;
      }

      function init() {
        ctrl.bars = appConfig.defaults.materialStrengths.bars;
        ctrl.ranges = appConfig.defaults.materialStrengths.ranges;

        ctrl.ranges.forEach(function(range) {
          rangesWithKey[range.value] = range;
        });

        let columns = angular.copy(MaterialStrength.columns);
        let rangeColumn = columns[1];
        rangeColumn.renderer = renderRange;

        ctrl.settings = {
          rowHeaders: false,
          colHeaders: true,
          nestedHeaders: MaterialStrength.nestedHeaders,
          columns: columns,
        };

        MaterialStrength.$query().then(function(materialStrengths) {
          ctrl.groupedMaterialStrengths = _.groupBy(materialStrengths, function(materialStrength) {
            return materialStrength.group;
          });

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
