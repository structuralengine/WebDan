'use strict';

/**
 * @ngdoc service
 * @name webdan.DesignPoint
 * @description
 * # DesignPoint
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('DesignPoint', ['$injector', 'LowResource', 'appConfig', 'designPointConfig', 'barConfig', 'fatigueConfig', 'designPointDefaults', 'HtHelper',
    function ($injector, LowResource, appConfig, designPointConfig, barConfig, fatigueConfig, designPointDefaults, HtHelper) {

      let foreignKey = 'designPointId';

      let DesignPoint = LowResource({
        "store": 'designPoints',
        "foreignKeys": {
          "parents": {
            Member: 'm_no',
          },
          "children": {
            Bar: foreignKey,
            Fatigue: foreignKey,
            BendingMoment: foreignKey,
            Shear: foreignKey,
          },
        },
        afterAdd: afterAdd,
      });

      function afterAdd(designPointId) {
        let children = this.foreignKeys.children;
        let aliasesWithSide = ['Bar', 'Fatigue'];

        angular.forEach(children, function(foreignKey, alias) {
          let Child = $injector.get(alias);

          // BendingMoment, Shear
          if (!aliasesWithSide.includes(alias)) {
            let data = {designPointId: designPointId};
            Child.add(data);
          }

          // Bar, Fatigue
          else {
            let config = (alias == 'Bar')? barConfig: fatigueConfig;
            let key = _.findKey(config, function(cfg) {
              return (cfg.var == 'rebar_side');
            });

            let sides = _.get(config, key +'.values', []);
            angular.forEach(sides, function(label, id) {
              let data = {
                designPointId: designPointId,
                rebar_side: id,
              };
              Child.add(data);
            });
          }
        });
      }

      DesignPoint.getDefaults = function() {
        if (appConfig.DesignPoint.useDefaults) {
          return designPointDefaults;
        }
        else {
          return [{}];
        }
      }

      _.mixin(DesignPoint, HtHelper);

      DesignPoint.htInit(designPointConfig);

      return DesignPoint;
    }
  ]);
