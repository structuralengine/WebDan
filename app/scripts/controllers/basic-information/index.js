'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BasicInformationIndexCtrl
 * @description
 * # BasicInformationIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BasicInformationIndexCtrl', ['$scope', 'basicInformationConfig',
    function ($scope, basicInformationConfig) {
      let ctrl = this;

      function createPickUpMoment() {
        let pickupMomentConfig = basicInformationConfig['pickup.moment'];
        let items = pickupMomentConfig.items;
        let data = Object.keys(items).map(function(key) {
          return [
            items[key].ja,
            null,
          ];
        });
        ctrl.settings.pickUpMoment = {
          rowHeaders: true,
          colHeaders: ['断面照査に用いる応力', 'PickUp No.'],
          data: data,
        };
      }

      function createPickUpShearForce() {
        let pickUpShearForceConfig = basicInformationConfig['pickup.shearforce'];
        let items = pickUpShearForceConfig.items;
        let data = Object.keys(items).map(function(key) {
          return [
            items[key].ja,
            null,
          ];
        });
        ctrl.settings.pickUpShearForce = {
          rowHeaders: true,
          colHeaders: ['断面照査に用いる応力', 'PickUp No.'],
          data: data,
        };
      }

      function createSpec() {
        ctrl.settings.spec = basicInformationConfig.spec;
      }

      function init() {
        ctrl.settings = {};
        createPickUpMoment();
        createPickUpShearForce();
        createSpec();

      }

      init();
    }
  ]);
