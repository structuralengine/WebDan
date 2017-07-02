'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BasicInformationCtrl
 * @description
 * # BasicInformationCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BasicInformationCtrl', ['$scope', '$location', 'BasicInformation', 'HtObject', 'basicInformationConfig',
    function ($scope, $location, BasicInformation, HtObject, basicInformationConfig) {
      let ctrl = this;

      ctrl.change = function(key) {
        BasicInformation.save(ctrl.basicInformation);
      }

      ctrl.isDisabled = function(key, key2) {
        if (ctrl.basicInformation && ctrl.basicInformation.axial && key2) {
          if (ctrl.basicInformation.axial === key) {
            return false;
          }
          ctrl.basicInformation[key2] = false;
        }
        return true;
      }

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.basicInformation = BasicInformation.query();

        let pickup = ctrl.pickup = {};
        let table = BasicInformation.table;
        let keys = ['moment', 'shearforce'];
        keys.forEach(function(key) {
          let config = Object.values(basicInformationConfig['pickup.'+ key])[0];
          let htObject = new HtObject(ctrl.basicInformation, {
            table: table,
            config: config,
          });
          pickup[key] = {
            settings: htObject.settings,
            datarows: htObject.datarows,
          };
        });

        ctrl.config = basicInformationConfig
      }

      init();
    }
  ]);
