'use strict';

/**
 * @ngdoc service
 * @name webdan.handsontableConfig
 * @description
 * # handsontableConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .service('handsontableConfig', ['appConfig',
    function (appConfig) {

      let defaultSettings = appConfig.defaults.handsontable.settings;

      this.create = function(params) {
        let settings = angular.copy(defaultSettings);

        let resource = params.resource;
        if (angular.isUndefined(resource)) {
          throw 'no resource for handsontable settings';
        }

        if (angular.isDefined(resource.add)) {
          if (angular.isUndefined(params.columns)) {
            throw 'settings require columns';
          }
          else {
            settings.columns = params.columns;
          }
        }
        else {
          settings.columns = [
            {data: 'key'},
            {data: 'value'},
          ];
        }

        settings.colHeaders = params.colHeaders || true;
        settings.rowHeaders = params.rowHeaders || true;
        settings.nestedHeaders = params.nestedHeaders || [];
        settings.minSpareRows = params.minSpareRows || 1;
        angular.merge(settings.contextMenu, params.contextMenu || {});

        settings.afterChange = function(changes, source) {
          if (source != 'loadData') {
            resource.afterChange(changes, this);
          }
        };

        settings.beforeRemoveRow = function(index, amount, logicalRows) {
          let get = this.getSourceDataAtRow;
          logicalRows.map(function(row) {
            let item = get(row);
            return item.id;
          })
          .forEach(function(id) {
            resource.remove(id);
          });
        };

        return settings;
      };

    }
  ]);
