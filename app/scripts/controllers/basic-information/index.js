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
        let configPath = 'pickup.items.'+ key +'.items';
        let config = _.get(BasicInformation.config, configPath, {});
        return Object.keys(config).map(function(prop) {
          let path = 'pickup.'+ key +'.'+ prop;
          return {
            path: path,
            label: config[prop].label,
            value: _.get(data, path, null),
          };
        });
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
        let basicInformation = ctrl.basicInformation = BasicInformation.query();
        ctrl.momentData = createPickUpData(basicInformation, 'moment');
        ctrl.shearForceData = createPickUpData(basicInformation, 'shearforce');

        let settings = ctrl.settings = {};
        angular.forEach(BasicInformation.config, function(config, key) {
          if (key == 'pickup') {
            let hts = angular.copy(htSettings);
            settings.pickup = {items: {
              moment: hts,
              shearforce: hts,
            }};
          }
          else {
            settings[key] = angular.copy(BasicInformation.config[key]);
          }
        });
      }

      init();
    }
  ]);
