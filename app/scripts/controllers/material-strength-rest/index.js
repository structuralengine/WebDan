'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthRestIndexCtrl
 * @description
 * # MaterialStrengthRestIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthRestIndexCtrl', ['$scope', '$log', '$filter', 'MaterialStrengthRest', 'Group', 'appConfig',
    function($scope, $log, $filter, MaterialStrengthRest, Group, appConfig) {
      let ctrl = this;

      function init() {
        ctrl.settings = {
          rowHeaders: false,
          colHeaders: true,
          nestedHeaders: MaterialStrengthRest.nestedHeaders,
          columns: MaterialStrengthRest.columns,
        };

        MaterialStrengthRest.$query().then(function(materialStrengthRest) {
          ctrl.groupedMaterialStrengthRest = _.groupBy(materialStrengthRest, function(materialStrength) {
            return materialStrength.group;
          });

          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
