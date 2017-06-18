'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SafetyFactorsMaterialStrengthsCtrl
 * @description
 * # SafetyFactorsMaterialStrengthsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SafetyFactorsMaterialStrengthsCtrl',
            ['$scope', '$filter', 'Member', 'SafetyFactor', 'MaterialStrength', 'MaterialStrengthRest', 'safetyFactorDefaults', 'materialStrengthDefaults', 'materialStrengthRestConfig', 'HtObject',
    function ($scope, $filter, Member, SafetyFactor, MaterialStrength, MaterialStrengthRest, safetyFactorDefaults, materialStrengthDefaults, materialStrengthRestConfig, HtObject) {
      let ctrl = this;

      function init() {
        // settings
        ctrl.settings = {
          safetyFactors: SafetyFactor.settings,
          materialStrengths: MaterialStrength.settings,
        };

        // groups
        let groups = Member.Group.query();
        ctrl.groups = $filter('orderBy')(groups, 'g_no').map(function(group) {
          group.g_no = $filter('number')(group.g_no, 1) + '';
          return group;
        });

        // Safety Factors
        let safetyFactors = SafetyFactor.query();
        if (safetyFactors.length == 0) {
          groups.forEach(function(group) {
            safetyFactorDefaults.forEach(function(name) {
              SafetyFactor.save({
                name: name,
                g_no: group.g_no,
              })
            });
          });
          safetyFactors = SafetyFactor.query();
        }
        ctrl.safetyFactors = _.groupBy(safetyFactors, function(safetyFactor) {
          return safetyFactor.g_no;
        });

        // Material Strengths
        let materialStrengths = MaterialStrength.query();
        if (materialStrengths.length == 0) {
          let bars = materialStrengthDefaults.bars;
          let ranges = materialStrengthDefaults.ranges;
          groups.forEach(function(group) {
            bars.forEach(function(bar) {
              ranges.forEach(function(range) {
                MaterialStrength.save({
                  bar: bar,
                  range: range,
                  g_no: group.g_no,
                })
              });
            });
          });
          materialStrengths = MaterialStrength.query();
        }
        ctrl.materialStrengths = _.groupBy(materialStrengths, function(materialStrength) {
          return materialStrength.g_no;
        });

        // Material Strength Rest
        let rests = MaterialStrengthRest.query();
        if (rests.length == 0) {
          groups.forEach(function(group) {
            MaterialStrengthRest.save({
              g_no: group.g_no,
            });
          });
          rests = MaterialStrengthRest.query();
        }
        let groupedRests = _.groupBy(rests, function(rest) {
          return rest.g_no;
        });
        let store = MaterialStrengthRest.store;
        Object.keys(groupedRests).forEach(function(g_no) {
          let rests = groupedRests[g_no];
          groupedRests[g_no] = rests.map(function(rest) {
            return new HtObject(rest, {
              store: store,
              config: materialStrengthRestConfig,
            });
          })
        });
        ctrl.materialStrengthRests = groupedRests;
      }

      init();
    }
  ]);
