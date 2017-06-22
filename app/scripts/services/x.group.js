'use strict';

/**
 * @ngdoc service
 * @name webdan.Group
 * @description
 * # Group
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Group', ['$injector', 'LowResource', 'groupConfig', 'safetyFactorConfig', 'materialStrengthConfig', 'HtHelper',
    function ($injector, LowResource, groupConfig, safetyFactorConfig, materialStrengthConfig, HtHelper) {

      let primaryKey = 'g_no';

      let Group = LowResource({
        'store': 'groups',
        'primaryKey': primaryKey,
        'foreignKeys': {
          'children': {
            Member: primaryKey,
            SafetyFactor: primaryKey,
            MaterialStrength: primaryKey,
            MaterialStrengthRest: primaryKey,
          },
        },
        afterAdd: afterAdd,
      });

      function afterAdd(g_no) {
        // SafetyFactor
        let SafetyFactor = $injector.get('SafetyFactor');
        let labels = safetyFactorConfig[''].values;
        labels.forEach(function(label) {
          let newSafetyFactor = {
            g_no: g_no,
            name: label,
          };
          SafetyFactor.save(newSafetyFactor);
        });

        // MaterialStrength
        let MaterialStrength = $injector.get('MaterialStrength');
        let configs = Object.values(materialStrengthConfig);
        let bars = configs[0].values;
        let ranges = configs[1].values;
        bars.forEach(function(bar) {
          ranges.forEach(function(range) {
            let newMaterialStrength = {
              bar: bar,
              range: range,
              g_no: g_no,
            };
            MaterialStrength.save(newMaterialStrength);
          });
        });

        // MaterialStrengthRest
        let MaterialStrengthRest = $injector.get('MaterialStrengthRest');
        let newMaterialStrengthRest = {g_no: g_no};
        MaterialStrengthRest.add(newMaterialStrengthRest);
      }

      _.mixin(Group, HtHelper);

      Group.htInit(groupConfig);

      return Group;
    }
  ]);
