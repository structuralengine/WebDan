'use strict';

/**
 * @ngdoc service
 * @name webdan.memberConfig
 * @description
 * # memberConfig
 * Constant in the webdan.
 */
angular.module("webdan")
  .constant("memberConfig", {
    "部材番号": {
      "en": 'Member No',
      "column": {
        "data": 'm_no',
        "type": 'numeric',
      },
    },
    "部材名": {
      "en": 'Member Name',
      "column": {
        "data": 'g_no',
        "path": 'g_name',
        "type": 'numeric',
        "format": '0.0',
        renderer: function(hot, td, row, col, prop, value, cellProperties) {
          let member = hot.getSourceDataAtRow(row);
          cellProperties.readOnly = !member.m_no;
          return td;
        },
      },
    },
  });
