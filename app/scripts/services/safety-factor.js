'use strict';

/**
 * @ngdoc service
 * @name webdan.SafetyFactor
 * @description
 * # SafetyFactor
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SafetyFactor', ['LowResource', 'safetyFactorConfig', 'considerRebarDefaults', 'HtHelper',
    function (LowResource, safetyFactorConfig, considerRebarDefaults, HtHelper) {

      let SafetyFactor = LowResource({
        'table': 'safetyFactors',
        'foreignKeys': {
          'parents': {
            Group: 'g_no',
          },
        },
      });

      _.mixin(SafetyFactor, HtHelper);
      SafetyFactor.htInit(safetyFactorConfig);

      let considerRebarCol = SafetyFactor.settings.columns.length - 1;
      SafetyFactor.settings.afterBeginEditing = function(row, col) {
        if (considerRebarCol == col) {
          let editor = this.getActiveEditor();
          let consider_rebar = editor.getValue();
          if (consider_rebar) {
            let rebar = _.find(considerRebarDefaults, {value: consider_rebar});
            if (rebar) {
              editor.setValue(rebar.name);
            }
          }
        }
      };

      let defaultAfterChange = SafetyFactor.settings.afterChange;
      SafetyFactor.settings.afterChange = function(changes, source) {
        if (source != 'loadData') {
          let hot = this;
          changes.forEach(function(change) {
            let [row, prop, oldNum, newNum] = change;
            if (prop == 'consider_rebar') {
              let rebar = _.find(considerRebarDefaults, {no: newNum});
              let consider_rebar = (rebar)? rebar.value: null;
              let datarow = hot.getSourceDataAtRow(row);
              datarow.consider_rebar = consider_rebar;
            }
          });

          defaultAfterChange.apply(hot, arguments);
        }
      };

      return SafetyFactor;
    }
  ]);
