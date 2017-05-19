'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsAddCtrl
 * @description
 * # BarsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsAddCtrl', ['$scope', '$log', '$q', 'Bar', 'DesignPoint', 'barsConfig',
    function ($scope, $log, $q, Bar, DesignPoint, barsConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        Bar.$add(ctrl.bar)
          .then(function(bar) {
            ctrl.bar = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      function init() {
        ctrl.config = barsConfig;

        DesignPoint.$queryAsc().then(function(designPoints) {
          ctrl.designPoints = designPoints;
        });
      }

      init();
    }
  ]);
