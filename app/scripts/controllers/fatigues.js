'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesCtrl
 * @description
 * # FatiguesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesCtrl', ['$scope', '$filter', 'Fatigue', 'Group', 'DesignPoint',
    function ($scope, $filter, Fatigue, Group, DesignPoint) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');

        let fatigues = Fatigue.query();
        ctrl.fatigues = _.groupBy(fatigues, function(fatigue) {
          let designPoint = DesignPoint.getAsc(fatigue.designPointId);
          return designPoint.Member.g_no;
        });

        let settings = Fatigue.settings;
        settings.minSpareRows = 0;
        ctrl.settings = settings;
      }

      init();
    }
  ]);
