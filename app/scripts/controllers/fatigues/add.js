'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesAddCtrl
 * @description
 * # FatiguesAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesAddCtrl', ['$scope', '$log', '$q', 'Fatigue', 'DesignPoint', 'fatiguesConfig',
    function ($scope, $log, $q, Fatigue, DesignPoint, fatiguesConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        Fatigue.$add(ctrl.fatigue)
          .then(function(fatigue) {
            ctrl.fatigue = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      function init() {
        ctrl.config = fatiguesConfig;

        DesignPoint.$queryAsc().then(function(designPoints) {
          ctrl.designPoints = designPoints;
        });
      }

      init();
    }
  ]);
