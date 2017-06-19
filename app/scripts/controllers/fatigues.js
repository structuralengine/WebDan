'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FatiguesCtrl
 * @description
 * # FatiguesCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FatiguesCtrl', ['$scope', '$filter', 'Fatigue', 'Member', 'DesignPoint', 'HtHelper',
    function ($scope, $filter, Fatigue, Member, DesignPoint, HtHelper) {
      let ctrl = this;

      function init() {
        ctrl.groups = Member.Group.query();

        let fatigues = Fatigue.query();
        let number = $filter('number');
        ctrl.fatigues = _.groupBy(fatigues, function(fatigue) {
          let designPoint = DesignPoint.getAsc(fatigue.designPointId);
          return number(designPoint.Member.g_no, 1);
        });

        ctrl.settings = {};
        angular.forEach(ctrl.fatigues, function(fatigues, g_no) {
          let settings = ctrl.settings[g_no] = angular.copy(Fatigue.settings);
          settings.mergeCells = HtHelper.mergeCells(fatigues, ['designPointId', 'designPointId']);
        });
      }

      init();
    }
  ]);
