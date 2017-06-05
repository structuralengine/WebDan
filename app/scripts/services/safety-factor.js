'use strict';

/**
 * @ngdoc service
 * @name webdan.SafetyFactor
 * @description
 * # SafetyFactor
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SafetyFactor', ['$lowArray', 'safetyFactorsConfig', 'appConfig', 'HtHelper',
    function ($lowArray, safetyFactorsConfig, appConfig, HtHelper) {

      let SafetyFactor = $lowArray({
        store: 'safetyFactors',
        foreignKeys: {
          parent: {
            "Group": 'group_id',
          },
        },
      });

      let parseColumns = SafetyFactor.parseColumns;
      SafetyFactor.parseColumns = function(columns) {
        parseColumns(columns);

        columns.forEach(function(column) {
          if (column.data == 'consider_rebar') {
            column.renderer = renderConsiderRebar;
          }
        })
      }

      let considerRebars = {};
      function renderConsiderRebar(instance, td, row, col, prop, value, cellProperties) {
        let content = '';
        if (value) {
          let considerRebar = considerRebars[value] || {};
          content = considerRebar.name;
        }
        angular.element(td).html(content);
        return td;
      }

      function init() {
        SafetyFactor.nestedHeaders = HtHelper.parseNestedHeaders(safetyFactorsConfig, 1);
        SafetyFactor.columns = HtHelper.parseColumns(safetyFactorsConfig);
        SafetyFactor.parseColumns(SafetyFactor.columns);

        appConfig.defaults.safetyFactors.considerRebars.forEach(function(considerRebar) {
          considerRebars[considerRebar.no] = considerRebar;
        });

        return SafetyFactor;
      }

      return init();
    }
  ]);
