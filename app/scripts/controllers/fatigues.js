'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesCtrl
 * @description
 * # FatiguesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesCtrl', ['$scope', '$filter', 'Fatigue', 'Member', 'DesignPoint',
    function ($scope, $filter, Fatigue, Member, DesignPoint) {
      let ctrl = this;

      function init() {
        let groups = Member.Group.query();
        ctrl.groups = $filter('orderBy')(groups, 'g_no');

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
