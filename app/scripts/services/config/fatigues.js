'use strict';

/**
 * @ngdoc service
 * @name webdan.fatiguesConfig
 * @description
 * # fatiguesConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatiguesConfig', {
    "部材番号": {
      en: "Member No",
      column: {
        data: "DesignPoint.Member.m_no",
        type: "numeric",
      },
    },
    "算出点名": {
      en: "Design Point",
      column: {
        data: "DesignPoint.p_name",
        type: "text",
      },
    },
    "断面": {
      en: "Section",
      items: {
        "B": {
          en: "Width",
          column: {
            data: "B",
            type: "numeric",
          },
        },
        "H": {
          en: "Height",
          column: {
            data: "H",
            type: "numeric",
          },
        },
      },
    },
  });
