'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BendingMomentsAddCtrl
 * @description
 * # BendingMomentsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BendingMomentsAddCtrl', ['$scope', '$log', 'BendingMoment', 'DesignPoint', 'bendingMomentsConfig',
    function ($scope, $log, BendingMoment, DesignPoint, bendingMomentsConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        BendingMoment.$add(ctrl.bendingMoment)
          .then(function(bendingMoment) {
            ctrl.bendingMoment = {};
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

        ctrl.fieldConfig = bendingMomentsConfig;
      }

      init();
    }
  ]);
