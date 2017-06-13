'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsCtrl
 * @description
 * # SafetyFactorsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsCtrl', ['$scope', '$filter', 'SafetyFactor', 'Group', 'DesignPoint',
    function ($scope, $filter, SafetyFactor, Group, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let safetyFactors = SafetyFactor.query();
        ctrl.safetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
          return safetyFactor.g_no;
        });

        let settings = SafetyFactor.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
