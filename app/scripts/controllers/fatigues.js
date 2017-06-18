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
        ctrl.settings = Fatigue.settings;
        ctrl.groups = Member.Group.query();

        let fatigues = Fatigue.query();
        let number = $filter('number');
        ctrl.fatigues = _.groupBy(fatigues, function(fatigue) {
          let designPoint = DesignPoint.getAsc(fatigue.designPointId);
          return number(designPoint.Member.g_no, 1);
        });
      }

      init();
    }
  ]);
