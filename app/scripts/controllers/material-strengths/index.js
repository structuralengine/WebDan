'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthsIndexCtrl
 * @description
 * # MaterialStrengthsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthsIndexCtrl', ['$scope', '$log', '$filter', 'MaterialStrength', 'Group', 'handsontableConfig',
    function($scope, $log, $filter, MaterialStrength, Group, handsontableConfig) {
      let ctrl = this;
      let rangesWithKey = {};

      function init() {
        let columns = angular.copy(MaterialStrength.columns);

        ctrl.settings = handsontableConfig.create({
          rowHeaders: false,
          minSpareRows: 0,
          nestedHeaders: MaterialStrength.nestedHeaders,
          columns: columns,
          resource: MaterialStrength,
        });

        ctrl.groupedMaterialStrengths = _.groupBy(MaterialStrength.query(), function(materialStrength) {
          return materialStrength.g_no;
        });

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
