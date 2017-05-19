'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthRestAddCtrl
 * @description
 * # MaterialStrengthRestAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthRestAddCtrl', ['$scope', '$log', '$filter', 'MaterialStrengthRest', 'Group', 'appConfig',
    function($scope, $log, $filter, MaterialStrengthRest, Group, appConfig) {
      let ctrl = this;

      ctrl.submit = function(form) {
        MaterialStrengthRest.$add(ctrl.materialStrengthRest)
          .then(function(materialStrengthRest) {
            ctrl.materialStrengthRest = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      function init() {
        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
