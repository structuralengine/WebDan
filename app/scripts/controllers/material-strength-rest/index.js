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

      function update(rowData) {
        let path = rowData.path;
        let value = rowData.value;
        $scope.$apply(function() {
          _.set(ctrl.materialStrengthRest, path, value);
        })
      }

      function createColumnData(data) {
        let config = MaterialStrengthRest.config;
        return Object.keys(config).map(function(prop) {
          return {
            path: prop,
            label: config[prop].label,
            value: _.get(data, prop, null),
          };
        });
      }

      function init() {
        ctrl.settings = {
          columns: [
            {data: 'label', readOnly: true, renderer: 'html'},
            {data: 'value', type: 'numeric', 'format': '0.1'},
          ],
          afterRender: function() {
          },
          afterChange: function(changes, soruce) {
            if (soruce != 'loadData') {
              let hot = this;
              changes.forEach(function(change) {
                let rowData = hot.getSourceDataAtRow(change[0]);
                update(rowData);
              })
            }
          },
        };

        MaterialStrengthRest.$query().then(function(materialStrengthRest) {
          let grouped = _.groupBy(materialStrengthRest, function(materialStrength) {
            return materialStrength.group;
          });

          angular.forEach(grouped, function(materialStrengthRest, groupKey) {
            grouped[groupKey] = createColumnData(materialStrengthRest[0]);
          });

          ctrl.groupedMaterialStrengthRest = grouped;
          ctrl.groups = Group.query();
        });
      }

      init();
    }
  ]);
