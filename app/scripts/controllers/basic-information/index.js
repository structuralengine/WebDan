'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BasicInformationIndexCtrl
 * @description
 * # BasicInformationIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BasicInformationIndexCtrl', ['$scope', 'BasicInformation',
    function ($scope, BasicInformation) {
      let ctrl = this;

      let htSettings = {
        rowHeaders: true,
        colHeaders: ['断面照査に用いる応力', 'PickUp No.'],
        columns: [
          {data: 'label', readOnly: true},
          {data: 'value'},
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

      function update(rowData) {
        let path = rowData.path;
        let value = rowData.value;
        $scope.$apply(function() {
          _.set(ctrl.basicInformation, path, value);
        })
      }

      function createPickUpData(data, key) {
        let config = BasicInformation.config.pickup[key] || {};
        return Object.keys(config).map(function(prop) {
          let path = 'pickup.'+ key +'.'+ prop;
          return {
            path: path,
            label: config[prop].label,
            value: _.get(data, path, null),
          };
        });
      }

      ctrl._unchecked = function(config, checked) {
        if (config) {
          let data = ctrl.basicInformation;
          angular.forEach(config, function(conf, key) {
            if (checked === false) {
              data[key] = false;
            }
          })
        }
      }

      ctrl.isDisabled = function(key, key2) {
        if (ctrl.basicInformation && ctrl.basicInformation.axis && key2) {
          if (ctrl.basicInformation.axis === key) {
            return false;
          }
          ctrl.basicInformation[key2] = false;
        }
        return true;
      }

      function init() {
        BasicInformation.$get().then(function(basicInformation) {
          ctrl.basicInformation = basicInformation || {};
          ctrl.momentData = createPickUpData(basicInformation, 'moment');
          ctrl.shearForceData = createPickUpData(basicInformation, 'shearforce');
        });

        ctrl.settings = {
          pickup: {
            moment: angular.copy(htSettings),
            shearforce: angular.copy(htSettings),
          },
          spec: angular.copy(BasicInformation.config.spec),
          limit: angular.copy(BasicInformation.config.limit),
          axis: angular.copy(BasicInformation.config.axis),
          rebar: angular.copy(BasicInformation.config.rebar),
          conditions: angular.copy(BasicInformation.config.conditions),
        };
      }

      init();
    }
  ]);
