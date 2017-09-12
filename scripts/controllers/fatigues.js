'use strict';

angular.module('webdan')
  .controller('FatiguesCtrl', ['$scope', '$filter', '$q', '$location', 'Fatigue', 'Member', 'DesignPoint', 'rebarSideFatigueDefaults', 'HtHelper',
    function ($scope, $filter, $q, $location, Fatigue, Member, DesignPoint, rebarSideFatigueDefaults, HtHelper) {
      let ctrl = this;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {
        ctrl.groups = Member.Group.query();

        let fatigues = Fatigue.query();
        if (fatigues.length > 0) {
          groupBy(fatigues);
        }
        else {
          let p1 = DesignPoint.query().map(function(designPoint) {
            return Fatigue.createDefaultEntries('designPointId', designPoint.id);
          });

          $q.all(p1).then(function() {
            fatigues = Fatigue.query();
            groupBy(fatigues);
          });
        }

        function groupBy(fatigues) {
          let number = $filter('number');
          ctrl.fatigues = _.groupBy(fatigues, function(fatigue) {
            let designPoint = DesignPoint.getAsc(fatigue.designPointId);
            return number(designPoint.Member.g_no, 1);
          });

          ctrl.settings = {};
          let mergeConfig = [
            {prop: 'designPointId', col: 0},
            {prop: 'designPointId', col: 1},
            {prop: 'designPointId', col: 2, rowspan: Object.keys(rebarSideFatigueDefaults).length}
          ];
          angular.forEach(ctrl.fatigues, function(fatigues, g_no) {
            let settings = ctrl.settings[g_no] = angular.copy(Fatigue.settings);
            settings.mergeCells = HtHelper.mergeCells(fatigues, mergeConfig);
          });
        }
      }

      init();
    }
  ]);
