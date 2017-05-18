'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ShearsAddCtrl
 * @description
 * # ShearsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ShearsAddCtrl', function ($scope, $log, Shear, DesignPoint, shearsConfig) {
    let ctrl = this;

    ctrl.submit = function(form) {
      Shear.$add(ctrl.shear)
        .then(function(shear) {
          ctrl.shear = {};
          form.$setPristine();
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function init() {
      DesignPoint.$queryAsc().then(function(designPoints) {
        ctrl.designPoints = designPoints;
      });

      ctrl.fieldConfig = shearsConfig;
    }

    init();
  });
