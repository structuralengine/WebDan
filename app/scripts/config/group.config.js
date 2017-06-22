'use strict';

/**
 * @ngdoc service
 * @name webdan.groupConfig
 * @description
 * # groupConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('groupConfig', {
    'グループNo': {
      column: {
        data: 'g_no',
        type: 'numeric',
        format: '0.1',
      },
    },
    '部材名': {
      column: {
        data: 'g_name',
        type: 'text',
        renderer: function(hot, td, row, col, prop, value, cellProperties) {
          let group = hot.getSourceDataAtRow(row);
          let readOnly = cellProperties.readOnly = !group.g_no;
          let className = (readOnly)? Handsontable.DefaultSettings.prototype.readOnlyCellClassName: '';
          angular.element(td).html(value).addClass(className);
          return td;
        }
      },
    },
  });
