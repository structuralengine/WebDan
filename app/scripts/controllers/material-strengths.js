'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthsCtrl
 * @description
 * # MaterialStrengthsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthsCtrl', ['$scope', '$filter', 'MaterialStrength', 'Group', 'DesignPoint',
    function ($scope, $filter, MaterialStrength, Group, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let materialStrengths = MaterialStrength.query();
        ctrl.materialStrengths = _.groupBy(materialStrengths, function(materialStrength) {
          return materialStrength.g_no;
        });

        let settings = MaterialStrength.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
