'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:Fatigue1sAddCtrl
 * @description
 * # Fatigue1sAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('Fatigue1sAddCtrl', function ($scope, $log, $q, Fatigue1, DesignPoint, fatigue1sConfig) {
    let ctrl = this;

    ctrl.submit = function(form) {
      Fatigue1.$add(ctrl.fatigue1)
        .then(function(fatigue1) {
          ctrl.fatigue1 = {};
          form.$setPristine();
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function init() {
      ctrl.config = fatigue1sConfig;

      DesignPoint.$queryAsc().then(function(designPoints) {
        ctrl.designPoints = designPoints;
      });
    }

    init();
  });
