'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:Bar1sAddCtrl
 * @description
 * # Bar1sAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('Bar1sAddCtrl', function ($scope, $log, $q, Bar1, DesignPoint, bar1sConfig) {
    let ctrl = this;

    ctrl.submit = function(form) {
      Bar1.$add(ctrl.bar1)
        .then(function(bar1) {
          ctrl.bar1 = {};
          form.$setPristine();
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function init() {
      ctrl.config = bar1sConfig;

      DesignPoint.$queryAsc().then(function(designPoints) {
        ctrl.designPoints = designPoints;
      });
    }

    init();
  });
