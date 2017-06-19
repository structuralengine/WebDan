'use strict';

/**
 * @ngdoc service
 * @name webdan.Shear
 * @description
 * # Shear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Shear', ['LowResource', 'DesignPoint', 'shearConfig', 'HtHelper',
    function (LowResource, DesignPoint, shearConfig, HtHelper) {

      let Shear = LowResource({
        "store": 'shears',
        "foreignKeys": {
          "parents": {
            DesignPoint: 'designPointId',
          },
        },
      });

      _.mixin(Shear, HtHelper);

      Shear.htInit(shearConfig);

      let p_name_col = (function(config) {
        let values = Object.values(config);
        let idx = _.findIndex(values, function(v) {
          return (v.column && v.column.path && v.column.path == 'p_name');
        });
        return idx;
      })(shearConfig);
      Shear.settings.afterBeginEditing = function(row, col) {
        if (col == p_name_col) {
          let editor = this.getActiveEditor();
          let designPointId = editor.getValue();
          if (designPointId) {
            let designPoint = DesignPoint.get(designPointId);
            editor.setValue(designPoint.p_name || '');
          }
        }
      };

      Shear.settings.beforeChange = function(changes, source) {
        if (source != 'loadData') {
          let hot = this;
          changes.forEach(function(change, i) {
            let [row, prop, designPointId, p_name] = change;
            if (prop == 'designPointId' && HtHelper.isUUID(designPointId) && !HtHelper.isUUID(p_name)) {
              let designPoint = DesignPoint.get(designPointId);
              designPoint.p_name = p_name;
              DesignPoint.save(designPoint);

              let shear = hot.getSourceDataAtRow(row);
              shear.designPointId = designPointId;

              HtHelper.refresh('bending-moments');

              changes[i] = null;
            }
          })
        }
      };

      return Shear;
    }
  ]);
