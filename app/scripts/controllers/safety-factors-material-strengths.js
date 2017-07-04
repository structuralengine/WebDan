'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsMaterialStrengthsCtrl
 * @description
 * # SafetyFactorsMaterialStrengthsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsMaterialStrengthsCtrl', ['$scope', '$filter', '$location', 'Member', 'SafetyFactor', 'MaterialStrength', 'MaterialStrengthRest', 'safetyFactorDefaults', 'materialStrengthDefaults', 'considerRebarDefaults', 'materialStrengthRestConfig', 'HtObject', 'htNestedHeaders', 'safetyFactorsNestedHeadersConfig',
    function ($scope, $filter, $location, Member, SafetyFactor, MaterialStrength, MaterialStrengthRest, safetyFactorDefaults, materialStrengthDefaults, considerRebarDefaults, materialStrengthRestConfig, HtObject, htNestedHeaders, safetyFactorsNestedHeadersConfig) {
      let ctrl = this;

      $scope.$on('reload', function(e) {
        $location.path('/');
      });

      function init() {

        // settings
        ctrl.settings = {
          safetyFactors: SafetyFactor.settings,
          materialStrengths: MaterialStrength.settings,
        };
        SafetyFactor.settings.afterRender = function() {
          htNestedHeaders.mergeCells(this, safetyFactorsNestedHeadersConfig);
        }
        ctrl.considerRebars = considerRebarDefaults;


        // groups
        let groups = ctrl.groups = Member.Group.query();


        // Safety Factors
        let safetyFactors = SafetyFactor.query();
        if (safetyFactors.length == 0) {
          groups.forEach(function(group) {
            SafetyFactor.createDefaultEntries('g_no', group.g_no);
          });
          safetyFactors = SafetyFactor.query();
        }
        let number = $filter('number');
        ctrl.safetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
          return number(safetyFactor.g_no, 1);
        });


        // Material Strengths
        let materialStrengths = MaterialStrength.query();
        if (materialStrengths.length == 0) {
          groups.forEach(function(group) {
            MaterialStrength.createDefaultEntries('g_no', group.g_no);
          });
          materialStrengths = MaterialStrength.query();
        }
        ctrl.materialStrengths = _.groupBy(materialStrengths, function(materialStrength) {
          return number(materialStrength.g_no, 1);
        });


        // Material Strength Rest
        let rests = MaterialStrengthRest.query();
        if (rests.length == 0) {
          groups.forEach(function(group) {
            MaterialStrengthRest.createDefaultEntries('g_no', group.g_no);
          });
          rests = MaterialStrengthRest.query();
        }
        let groupedRests = _.groupBy(rests, function(rest) {
          return number(rest.g_no, 1);
        });
        let table = MaterialStrengthRest.table;
        Object.keys(groupedRests).forEach(function(g_no) {
          let rests = groupedRests[g_no];
          groupedRests[g_no] = rests.map(function(rest) {
            return new HtObject(rest, {
              table: table,
              config: materialStrengthRestConfig,
            });
          })
        });
        ctrl.materialStrengthRests = groupedRests;
      }

      init();
    }
  ]);
